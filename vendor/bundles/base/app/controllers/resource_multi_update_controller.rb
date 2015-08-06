class ResourceMultiUpdateController < DomainResourcesController
  
  public

  # 임시 코드 - TODO 에러 원인 파악 
  def create(options={}, &block)
    object = build_resource

    if create_resource(object)
      options[:location] ||= smart_resource_url
    end

    #respond_with_dual_blocks(object, options, &block)
    respond_to do |format|
      format.xml  { render :xml => object }
      format.json { render :json => object }
    end
  end

  # 임시 코드 - TODO 에러 원인 파악 
  def update(options={}, &block)
    object = resource

    if update_resource(object, resource_params)
      options[:location] ||= smart_resource_url
    end

    # respond_with_dual_blocks(object, options, &block)
    respond_to do |format|
      format.xml  { render :xml => object }
      format.json { render :json => object }
    end
  end

  # 임시 코드 - TODO 에러 원인 파악 
  def destroy(options={}, &block)
    object = resource
    options[:location] ||= smart_collection_url

    destroy_resource(object)
    #respond_with_dual_blocks(object, options, &block)
    respond_to do |format|
      format.xml  { render :xml => { :success => true } }
      format.json { render :json => { :success => true } }
    end
  end
    
  def update_multiple
    correspond_class = resource_class
    id_field = correspond_class.primary_key
    domain_resource_flag = correspond_class.public_instance_methods.include?(:domain)
    delete_list, update_list, create_list = self.refine_multiple_data(params[:multiple_data], id_field)
    
    correspond_class.transaction do
      # 1. delete
      self.destroy_multiple_data(correspond_class, delete_list)
      # 2. update
      self.update_multiple_data(correspond_class, update_list, id_field, multi_update_attrs_to_rem, multi_update_attrs_to_add)
      # 3. create
      self.create_multiple_data(correspond_class, create_list, domain_resource_flag, id_field, multi_create_attrs_to_rem, multi_create_attrs_to_add)
    end
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => :success} }
      format.json { render :json => {:success => true, :msg => :success} }
    end
  end
  
  protected
  
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
  
  #
  # 클라이언트로 부터 넘어온 multiple_data를 삭제 데이터, 수정 데이터, 생성 데이터로 분리하여 리턴 
  #
  def refine_multiple_data(multiple_data, id_field)
    if(multiple_data && multiple_data.class.name == 'string')
      data_list = JSON.parse(multiple_data)
    else
      data_list = multiple_data
    end
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
  def destroy_multiple_data(correspond_class, multiple_data)
    correspond_class.destroy(multiple_data) unless multiple_data.empty?
  end
  
  #
  # correspond_class로 갱신할 데이터를 수정한다. 
  # 이 때 idField 명을 받아서 data로 부터 해당 필드값을 꺼내 correspond_class의 인스턴스를 찾은 다음 data를 update 한다.
  # update전에 추가해야 할 속성명, 값과 삭제해야 할 속성명이 있다면 각 레코드당 처리한다.
  #
  def update_multiple_data(correspond_class, multiple_data, id_field, attrs_to_remove = [], attrs_to_add = {})
    multiple_data.each do |data|
      found_resource = correspond_class.find_by_id(data.delete(id_field))
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
  def create_multiple_data(correspond_class, multiple_data, domain_resource_flag, id_field, attrs_to_remove = [], attrs_to_add = {})
    multiple_data.each do |data|
      data.delete(id_field)
      attrs_to_remove.each { |p| data.delete(p) }
      data.merge(attrs_to_add) unless attrs_to_add.empty?
      data['domain_id'] = current_domain.id if(domain_resource_flag)
      correspond_class.create!(data)
    end if multiple_data
  end
  
end