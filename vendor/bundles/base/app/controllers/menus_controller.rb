class MenusController < ResourceMultiUpdateController
  
  def index
    mode = params[:mode].blank? ? 'MENU' : params[:mode]
    # 권한 적용시 아래 주석 해제 
    if(mode != 'AUTH')
      conditions, include_arr, order_str, limit, offset = search_filter resource_class
      @total_count = collection.where(conditions).count
      @collection = collection.includes(include_arr).where(conditions).order(order_str).limit(limit).offset(offset)
    else
      role_id_arr = UsersRoles.select("role_id").where("user_id = ?", current_user.id).collect { |ur| ur.role_id }
      sql = auth_query(role_id_arr)
      results = Menu.connection.select_all(sql)
      @collection = []
      
      results.each do |result|
        item = @collection.find { |i| i['id'] == result['id'] }
        unless item
          item = result
          unless(item['auth'].blank?)
            case item['auth']
            when 'create'
              item['auth'] = 'C'
            when 'show'
              item['auth'] = 'R'
            when 'update'
              item['auth'] = 'U'
            when 'delete'
              item['auth'] = 'D'
            end
          end
          @collection.push(item)
        else
          unless(result['auth'].blank?)
            case result['auth']
            when 'create'
              item['auth'] = "#{item['auth']},D"
            when 'show'
              item['auth'] = "#{item['auth']},R"
            when 'update'
              item['auth'] = "#{item['auth']},U"
            when 'delete'
              item['auth'] = "#{item['auth']},D"
            end
          end
        end
      end
      
      @total_count = @collection.size
      respond_to do |format|
        format.xml { render :xml => {:items => @collection, :total => @total_count, :success => true} } 
        format.json { render :json => {:items => @collection, :total => @total_count, :success => true} }
      end
    end
  end
  
  #
  # Positive rule
  # 일단 오라클 쿼리로 구현, TODO Standard화 필요 
  #
  def auth_query(role_id_list)
    if(role_id_list && !role_id_list.empty?)
      sql = <<-EOS
        select 
        	m.id,
        	m.name,
        	m.description,
        	m.category,
        	m.parent_id,
        	m.template,
        	m.menu_type,
        	m.rank,
        	p.action_name auth
        from 
        	menus m,
        	permissions p 
        where 
        	m.id = p.resource_id and
        	m.hidden_flag != true and
        	p.resource_type = 'Menu' and
        	p.role_id in ('#{role_id_list.join("','")}')
        group by
        	m.id,p.action_name
        order by
        	m.rank, m.id, p.action_name
      EOS
      return sql
    else
      # 역할이 없다면 일단 모든 메뉴를 내려준다.
      sql = "select id, name, description, category, parent_id, template, menu_type, rank, '' auth from menus where hidden_flag != true order by rank asc"
      return sql
    end
  end
  
  #  
  # GET menus/:id/menu_params
  #
  def menu_params
    menu = Menu.find(params[:id])
    menu_params = menu.menu_params
    respond_to do |format|
      format.xml { render :xml => { :items => menu_params } } 
      format.json { render :json => { :items => menu_params } }
    end
  end
  
  #
  # POST menus/:id/update_multiple_menu_params
  # 
  def update_multiple_menu_params
    menu = Menu.find(params[:id])
    delete_list, update_list, create_list = refine_multiple_data(params[:multiple_data], 'id')

    MenuParam.transaction do
      # 1. delete
      destroy_multiple_data(MenuParam, delete_list)
      # 2. update
      update_multiple_data(MenuParam, update_list, 'id', ['menu_id'], {})
      # 3. create
      create_multiple_data(MenuParam, create_list, false, 'id', ['domain_id'], {})
    end

    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => :success} }
      format.json { render :json => {:success => true, :msg => :success} }
    end
  end
  
end
