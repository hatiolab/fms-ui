class MongoController < ActionController::Base
  
  private
  
  def searching(entity, params)
    where_params, where_conds, sorts = params["_q"], {}, []
    params["_o"].each { |ord| sorts << ord['name'] + " " + ord['direction'] } if params["_o"]
    
    if params["sort"]
      sort_list = JSON.parse(params["sort"])
      sort_list.each { |sort| sorts << sort['property'] + " " + sort['direction'] }
    end
    
    sort_str = sorts ? sorts.join(',') : 'id desc'
    
    where_params.each do |n, v| 
      next if(v.empty?)
      cond_arr = n.split('-')
      cond_name, cond_opr = cond_arr[0], cond_arr[1]

      # 일단 in만 처리 ...
      if(cond_opr == 'in') 
        val = (v.class.name == 'String') ? v.split(',') : v
        where_conds[cond_name] = { '$in' => val }
      else
        where_conds[cond_name] = v
      end
    end if(where_params)

    skip = (params[:page].to_i - 1) * params[:limit].to_i
    
    unless(where_conds.empty?)
      total_count = entity.all_of(where_conds).count
      items = entity.all_of(where_conds).order(sort_str).skip(skip).limit(params[:limit].to_i)
    else
      total_count = entity.count
      items = entity.order(sort_str).skip(skip).limit(params[:limit].to_i)
    end

    return {:items => items, :total => total_count, :success => true}
  end
  
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
