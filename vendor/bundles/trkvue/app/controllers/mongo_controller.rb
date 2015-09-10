class MongoController < DomainAppController
  
  private

  DATE_FIELDS = ['etm', 'ttm', 'ctm', 'stm', 'utm']
  
  #
  # Common Search Function
  #
  def searching(entity, params)
    where_params, where_conds, sorts = params["_q"], { 'dom' => Domain.current_domain.id }, []
    params["_o"].each { |key, value| sorts << "#{key} #{value}" } if params["_o"]
    
    if params["sort"]
      sort_list = JSON.parse(params["sort"])
      sort_list.each { |sort| sorts << sort['property'] + " " + sort['direction'] }
    end
    
    sort_str = sorts ? sorts.join(',') : 'id desc'
    
    where_params.each do |n, v| 
      next if(v.empty?)
      cond_arr = n.split('-')
      cond_name, cond_opr = cond_arr[0], cond_arr[1]

      # in
      if(cond_opr == 'in') 
        val = (v.class.name == 'String') ? v.split(',') : v
        where_conds[cond_name] = { '$in' => val }
      # gte
      elsif(cond_opr == 'gte')
        where_conds[cond_name] = { '$gte' => convert_from(cond_name, v) }
      # lte
      elsif(cond_opr == 'lte')
        where_conds[cond_name] = { '$lte' => convert_to(cond_name, v) }
      # between
      elsif(cond_opr == 'between')
        between_vals = v ? v.split(',') : ''
        val_1, val_2 = convert_from(cond_name, between_vals[0]), convert_to(cond_name, between_vals[1])
        debug_print "from : #{val_1}, to : #{val_2}"
        where_conds[cond_name] = { '$gte' => val_1, '$lte' => val_2 } if(between_vals && between_vals.length >= 2)
      # eq
      else
        where_conds[cond_name] = v
      end
    end if(where_params)

    total_count = entity.all_of(where_conds).count
    items = entity.all_of(where_conds).order(sort_str).skip(params[:start].to_i).limit(params[:limit].to_i)
    return {:items => items, :total => total_count, :success => true, :conditions => where_conds}
  end
  
  def convert_from(field, value) 
    DATE_FIELDS.include?(field) ? to_from_times(value) : value
  end

  def convert_to(field, value)
    DATE_FIELDS.include?(field) ? to_to_times(value) : value
  end

  def to_from_times(dateStr)
    time = ActiveSupport::TimeZone[Domain.current_domain.timezone].parse(dateStr).to_time.to_i * 1000
    debug_print "Time zone : #{Domain.current_domain.timezone}, From Date : #{dateStr}, Value : #{time}"
    return time
  end

  def to_to_times(dateStr)
    toDateStr = (Date.parse(dateStr) + 1).strftime('%Y-%m-%d')
    time = ActiveSupport::TimeZone[Domain.current_domain.timezone].parse(toDateStr).to_time.to_i * 1000
    debug_print "Time zone : #{Domain.current_domain.timezone}, To Date : #{toDateStr}, Value : #{time}"
    return time
  end  

  #
  # Common Update Multiple Function
  #
  def update_multiple_data(entity, params)
    delete_list, update_list, create_list = self.refine_multiple_data(params[:multiple_data], "id")
    # 1. delete
    self.destroy_multiple_data(entity, delete_list)
    # 2. update
    self.modify_multiple_data(entity, update_list, "id", multi_update_attrs_to_rem, multi_update_attrs_to_add)
    # 3. create
    self.create_multiple_data(entity, create_list, "id", multi_update_attrs_to_rem, multi_update_attrs_to_add)
    return {:success => true, :msg => :success}
  end
  
  protected
  
  #
  # 클라이언트로 부터 넘어온 multiple_data를 삭제 데이터, 수정 데이터, 생성 데이터로 분리하여 리턴 
  #
  def refine_multiple_data(multiple_data, id_field)
    data_list = JSON.parse(multiple_data)
    delete_list, update_list, create_list = [], [], [];
  
    data_list.each do |data|
      cud_flag = data.delete('_cud_flag_')
      delete_list << data[id_field] if(cud_flag == "d")
      update_list << data if(cud_flag == "u")
      create_list << data if(cud_flag == "c")
    end
    
    return delete_list, update_list, create_list
  end
  
  #
  # 삭제할 데이터 아이디로 correspond_class의 destroy를 호출 
  #
  def destroy_multiple_data(entity, multiple_data)
    multiple_data.each do |data|
      record = entity.find(data);
      record.destroy
    end
  end
  
  #
  # correspond_class로 갱신할 데이터를 수정한다. 
  # 이 때 idField 명을 받아서 data로 부터 해당 필드값을 꺼내 correspond_class의 인스턴스를 찾은 다음 data를 update 한다.
  # update전에 추가해야 할 속성명, 값과 삭제해야 할 속성명이 있다면 각 레코드당 처리한다.
  #
  def modify_multiple_data(entity, multiple_data, id_field, attrs_to_remove = [], attrs_to_add = {})
    multiple_data.each do |data|
      found_resource = entity.find(data.delete(id_field))
      if found_resource
        attrs_to_remove.each { |p| data.delete(p) }
        data.merge(attrs_to_add) unless attrs_to_add.empty?
        found_resource.update_attributes(data)
      end
    end if multiple_data
  end
  
  #
  # correspond_class로 추가할 데이터를 생성한다. 
  # domain_resource_flag는 domain 하위 리소스인지를 나타낸다. 해당 리소스가 domain 하위가 아니라면 false로 설정한다.
  # update전에 추가해야 할 속성명, 값과 삭제해야 할 속성명이 있다면 각 레코드당 처리한다.
  #
  def create_multiple_data(entity, multiple_data, id_field, attrs_to_remove = [], attrs_to_add = {})
    multiple_data.each do |data|
      data.delete(id_field)
      attrs_to_remove.each { |p| data.delete(p) }
      data.merge(attrs_to_add) unless attrs_to_add.empty?
      entity.create!(data)
    end if multiple_data
  end
  
  def multi_update_attrs_to_rem
    []
  end
  
  def multi_create_attrs_to_rem
    []
  end
  
  def multi_update_attrs_to_add
    {}
  end
  
  def multi_create_attrs_to_add
    {}
  end
  
end
