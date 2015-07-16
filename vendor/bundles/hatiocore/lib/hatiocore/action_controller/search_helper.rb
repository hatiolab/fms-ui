module Hatio
  module SearchHelper
    
    #
    # 검색 조건, 소트 조건, Pagination 조건을 분석하여 검색을 구현 
    #
    def search_filter resource, options = {}
      # pagination 정보는 넘어온 page, limit 정보를 이용
      page, limit, offset = find_pagination_info
      search_param_type, search_params = nil, nil
      
      # search parameter는 filter or _q 파라미터를 이용 
      if(!params[:_q].blank?) 
        search_param_type, search_params = 1, params[:_q]
      elsif(!params[:filter].blank?)
        search_param_type, search_params = 2, params[:filter]
      else
        search_param_type, search_params = 1, params
      end
      
      # sort parameter는 sort or _o 파라미터를 이용 
      sort_type, sort_params, order_result = nil, nil, ""
      if(!params[:_o].blank?)
        sort_type, sort_params = 1, params[:_o]
      elsif(!params[:sort].blank?)
        sort_type, sort_params = 2, params[:sort]
      end
      
      # table name을 찾고 where 조건의 컬럼명 앞에 table_name.을 붙인다. Join 쿼리를 사용 할 경우 애매한 열 정의를 없애기 위함
      table_name = options.key?(:table_name) ? options[:table_name] : resource.table_name
      entity = Entity.find_by_name(resource.to_s)
      if(entity)
        columns = entity.columns_for_search
        # select fields는 select parameter가 있으면 select parameter를, 없으면 select *
        list_columns = find_select_columns(columns)
      
        if(search_param_type == 1)
          conditions = build_conditions_by_search_params(table_name, search_params, columns)
        elsif(search_param_type == 2)
          conditions = build_conditions_by_filters(table_name, search_params, columns)
        end

        # select parameter로 association이 있는 부분을 찾아서 ...
        include_arr = find_association_list(resource, list_columns, options)
        order_result = (sort_type == 1) ? build_orders_by_sort_params(sort_params) : build_orders_by_sorters(sort_params) if(sort_type)
        return conditions, include_arr, order_result, limit, offset
      else
        debug_print "Not found Entity of resource [#{resource.to_s}]"
        return "", [], "", limit, offset
      end
    end
    
    #
    # select fields를 찾는다. select 파라미터가 넘어오면 해당 필드만, 그렇지 않으면 모든 필드가 select 대상이다.
    #
    def find_select_columns(columns)
      select_columns = (!params[:_s] || params[:_s].blank?) ? [] : params[:_s]
      return select_columns.empty? ? 
        columns : 
        columns.select{ |c| select_columns.include?(c.name) || select_columns.include?(c.name.sub(/_id$/, '')) }
    end
    
    #
    # 필드 타입 정보를 바탕으로 검색 조건 값을 sql에 맞게 변환한다.
    #
    def convert_value_by_col_type(filter_value, column)
      if(column.col_type == 'time' || column.col_type == 'datetime' || column.col_type == 'timestamp')
        return (filter_value.size <= 10) ? parse_date(filter_value) : parse_time_to_db(filter_value) 
      elsif(column.col_type == 'date')
        return parse_date(filter_value)
      elsif(column.col_type == 'boolean')
        return (filter_value.to_s =~ /^(t|true|on|y|yes)$/i) == 0 ? true : false
      else
        return filter_value
      end
    end
    
    #
    # like 타입 검색 조건이면 like 검색을 위해서 검색 조건 값을 like문에 맞게 변환한다.
    #
    def convert_like_type_condition_value(operator, value)
      return value unless like_type_operator?(operator)
      value = value.strip
      
      case operator
      when 'like'         # like
        return "%#{value}%"
      when 'contains'     # equals to like
        return "%#{value}%"
      when 'nlike'        # not like
        return "%#{value}%"
      when 'sw'           # starts with
        return "#{value}%"
      when 'dnsw'         # does not start with
        return "#{value}%"
      when 'ew'           # ends with
        return "%#{value}"
      when 'dnew'         # does not end with
        return "%#{value}"
      when 'in'
      	val_arr = value.split(",")
      	return val_arr;
      when 'notin' 
      	val_arr = value.split(",")
      	return val_arr;        
      end
    end
    
    #
    # 검색 조건 중에 검색 조건 값이 필요 없는 검색 조건인지 판단한다.
    #
    def none_value_operator?(operator)
      ['is_null', 'is_not_null', 'is_true', 'is_false', 'is_present', 'is_blank'].include?(operator)
    end
    
    #
    # 검색 조건 중에 like 타입의 조건인지를 판단한다. 
    #
    def like_type_operator?(operator)
      ['like', 'contains', 'nlike', 'sw', 'dnsw', 'ew', 'dnew', 'in', 'notin'].include?(operator)
    end
    
    #
    # 검색 조건 타입에 따라 sql where 문을 작성한다. 
    #
    def get_condition_str(table_name, column_name, operator)
      case operator
      when 'eq'           # equal
        return " #{table_name}.#{column_name} = ?"
      when 'noteq'        # not equal
        return " #{table_name}.#{column_name} != ?"
      when 'in'           # in
        return " #{table_name}.#{column_name} in (?)"
      when 'notin'        # not in
        return " #{table_name}.#{column_name} not in (?)"
      when 'like', 'contains', 'sw', 'ew'     # like
        return " lower(#{table_name}.#{column_name}) like lower(?)"
      when 'nlike', 'dnsw', 'dnew'            # not like
        return " lower(#{table_name}.#{column_name}) not like lower(?)"
      when 'gt'           # greater than
        return " #{table_name}.#{column_name} > ?"
      when 'gte'          # greater than equal
        return " #{table_name}.#{column_name} >= ?"
      when 'lt'           # less than
        return " #{table_name}.#{column_name} < ?"
      when 'lte'          # less than equal
        return " #{table_name}.#{column_name} <= ?"
        
      when 'dt_eq'           # date equal
        return " #{GlobalConfig.to_date_db_func}(#{table_name}.#{column_name}) = ?"
      when 'dt_noteq'        # date not equal
        return " #{GlobalConfig.to_date_db_func}(#{table_name}.#{column_name}) != ?"
      when 'dt_gt'           # date greater than
        return " #{GlobalConfig.to_date_db_func}(#{table_name}.#{column_name}) > ?"
      when 'dt_gte'          # date greater than equal
        return " #{GlobalConfig.to_date_db_func}(#{table_name}.#{column_name}) >= ?"
      when 'dt_lt'           # date less than
        return " #{GlobalConfig.to_date_db_func}(#{table_name}.#{column_name}) < ?"
      when 'dt_lte'          # date less than equal
        return " #{GlobalConfig.to_date_db_func}(#{table_name}.#{column_name}) <= ?"
        
      when 'is_null'      # is null
        return " #{table_name}.#{column_name} is null"
      when 'is_not_null'  # is not null
        return " #{table_name}.#{column_name} is not null"
      when 'is_true'      # is true
        return " #{table_name}.#{column_name} = true"
      when 'is_false'     # is false
        return " #{table_name}.#{column_name} = false"
      when 'is_present'   # not null or not empty string
        return " (#{table_name}.#{column_name} is not null and #{table_name}.#{column_name} != '')"
      when 'is_blank'     # null or empty string
        return " (#{table_name}.#{column_name} is null or #{table_name}.#{column_name} = '')"
      end
      return "";
    end
    
    #
    # filter로 search condition 정보 생성 
    #
    def build_conditions_by_filters(table_name, filter_str, columns)
      # filter_str을 파싱하여 filter 오브젝트로 변환 
      filters, where_sql_arr, conditions = JSON.parse(filter_str), ["#{table_name}.id is not null"], []
      filters.each do |filter|
        # filter의 name, value으로 validation check
        filter_name, filter_value, operator = validate_filter_info(columns, filter['property'], filter['value'])
        # valid 하지 않으면 처리하지 않는다.
        next unless filter_name        
        # 검색조건 필드명이 entity_column에 등록되어 있는 경우에는 entity_column에서 필드 타입을 찾아 알맞은 타입으로 조건 값을 변경 
        entity_column = columns.find { |c| c.name == filter_name } if columns
        filter_value = convert_value_by_col_type(filter_value, entity_column) if entity_column
        # like 타입이라면 검색 조건이라면 like문에 맞게 값에 조건문을 수정한다. (like, not like)
        where_sql_arr << get_condition_str(table_name, filter_name, operator)
        # like 타입이라면 검색 조건이라면 like문에 맞게 값에 %를 붙인다. ('%찾을 문자열%', '%찾을 문자열', '찾을 문자열%')
        filter_value = convert_like_type_condition_value(operator, filter_value) 
        #debug_print("Filter : #{filter_name}, Value : #{filter_value}, Operator : #{operator}")
        # 하나의 필드에 대한 조건 값을 conditions 배열에 추가한다. 
        conditions.push(filter_value) unless none_value_operator?(operator)
      end
      # 최종적으로 만들어진 sql where문을 conditions 배열 맨 앞쪽에 추가한다. 
      conditions.insert(0, where_sql_arr.join(" and "))
    end

    #
    # search params로 search condition 정보 생성
    #
    def build_conditions_by_search_params(table_name, search_params, columns)
      where_sql_arr, conditions = ["#{table_name}.id is not null"], []
      # 넘어온 검색 조건 값을 - 로 구분하여 앞 부분은 검색 조건 필드명으로, 뒷 부분은 검색을 위한 operator로 사용햔다. 
      search_params.each do |param_name, param_value|
        # filter의 name, value으로 validation check
        filter_name, filter_value, operator = validate_filter_info(columns, param_name, param_value)
        # valid 하지 않으면 처리하지 않는다.
        next unless filter_name        
        # 검색조건 필드명이 entity_column에 등록되어 있는 경우에는 entity_column에서 필드 타입을 찾아 알맞은 타입으로 조건 값을 변경 
        entity_column = columns.find { |c| c.name == filter_name } if columns
        filter_value = convert_value_by_col_type(filter_value, entity_column) if entity_column
        # like 타입이라면 검색 조건이라면 like문에 맞게 값에 조건문을 수정한다. (like, not like)
        where_sql_arr << get_condition_str(table_name, filter_name, operator)
        # like 타입이라면 검색 조건이라면 like문에 맞게 값에 %를 붙인다. ('%찾을 문자열%', '%찾을 문자열', '찾을 문자열%')
        filter_value = convert_like_type_condition_value(operator, filter_value) 
        #debug_print("Filter : #{filter_name}, Value : #{filter_value}, Operator : #{operator}")
        # 하나의 필드에 대한 조건 값을 conditions 배열에 추가한다. 
        conditions.push(filter_value) unless none_value_operator?(operator)
      end
      conditions.insert(0, where_sql_arr.join(" and "))
    end
    
    #
    # filter 정보를 validation한다. 
    #
    def validate_filter_info(columns, filter_name, filter_value)
      # filter_name이 domain_id라면 스킵 
      return false if(filter_name.start_with?('domain_id'))
      gubunIndex = filter_name.rindex('-')
      filter_name_length = filter_name.length
      # - 로 구분된 문자열이 없다면 조건 검색을 위한 용도가 아니라고 판단 
      return false unless gubunIndex
      # operator는 무조건 두 글자 이상이어야 한다.
      return false unless (filter_name_length - gubunIndex > 1)
      # 넘어온 검색 조건 값을 - 로 구분하여 앞 부분은 검색 조건 필드명으로, 뒷 부분은 검색을 위한 operator로 사용햔다. 
      column_name, operator = filter_name[0 .. (gubunIndex - 1)], filter_name[(gubunIndex + 1) .. (filter_name_length - 1)]
      # resource.name-eq 형식으로 넘어온 경우는 Resource.find_by_name으로 검색하고 파라미터 명은 resource_id-eq형식으로 변환한다.
      column_name, filter_value, operator = convert_reference_filter(column_name, filter_value, operator)
      # 값이 비어 있고 조건 값이 필요없는 경우 ('is_null', 'is_not_null', 'is_true', 'is_false', 'is_present', 'is_blank')가 아니면 스킵 
      return false if (filter_value.blank? && !none_value_operator?(operator))
      return false unless (include_entity_column?(columns, column_name))
      return column_name, filter_value, operator
    end
    
    #
    # filter name이 entity column내에 속해 있는지 확인한다. 
    #
    def include_entity_column?(columns, filter_name)
      fc = columns.find { |column| column.name == filter_name }
      return !fc.nil?
    end
    
    #
    # resource.name-eq 형식으로 넘어온 파라미터는 Resource.find_by_name(파라미터 값)으로 검색하여 id를 찾아 값을 대치하고 파라미터 명도 resource_id-eq로 대치
    # TODO operator가 like 였을 경우 join query가 되어야 하고 파라미터 값은 join table의 검색 조건으로 변경되어야 한다.
    #
    def convert_reference_filter(column_name, filter_value, operator)
      column_name_arr = column_name.split('.')
      return column_name, filter_value, operator if(column_name_arr.size <= 1 || filter_value.blank?)
      
      # 새로운 컬럼명 : {entityname}_id
      new_column_name = "#{column_name_arr[0]}_id"
      if(column_name_arr[1] == 'id')
        return new_column_name, filter_value, operator
      else
        resource = column_name_arr[0].camelcase.constantize
        conds = { column_name_arr[1].to_sym => filter_value }
        #conds[:domain_id] = @domain.id if(@domain.respond_to?(resource.name.pluralize.to_sym))
        instance = resource.where(conds).first
        return new_column_name, (instance ? instance.id : ''), operator
      end
    end
    
    #
    # 넘어온 sort 정보로 부터 sort정보를 추출 - "[{"property":"name","direction":"DESC"}]"
    #
    def build_orders_by_sort_params(orders)
      return (orders && !orders.empty?) ? orders.collect { |name, direction| "#{name} #{direction}"}.join(",") : ""
    end
    
    #
    # 넘어온 sort parameter 정보로 부터 sort정보를 추출 
    #
    def build_orders_by_sorters(sorter_str)
      order_result = ""
      if(sorter_str && !sorter_str.blank?)
        sorters = JSON.parse(sorter_str)
        order_result = sorters.collect { |sorter| "#{sorter['property']} #{sorter['direction']}" }.join(",")
      end
      return order_result
    end
    
    #
    # params로 부터 pagination을 위한 정보를 추출한다. 
    #
    def find_pagination_info
      page = (params[:page] || 1).to_i
      limit = (params[:limit] || GlobalConfig.default_page_size).to_i
      offset = (page - 1) * limit
      return page, limit, offset
    end
    
    #
    # resource의 entity_columns 정보 중 select 필드를 바탕으로 관계 정보를 추출한다.
    #
    def find_association_list(resource, columns, options = {})
      ref_columns = columns.select { |c| c.name != "domain_id" && c.ref_type == "Entity" && c.ref_name }
      return ref_columns.collect do |column|
        association_symbol = column.name.sub(/_id$/, '').to_sym
        association = resource.reflect_on_association association_symbol
        if association
          association_symbol unless association.options[:polymorphic] == true
        else
          association = resource.reflect_on_all_associations.detect { |a| a.options[:foreign_key] == column.name.to_sym }
          if association
            association.name.to_sym
          else
            association = resource.reflect_on_all_associations.detect { |a| a.options[:class_name] == column.ref_name }
            association.name.to_sym if association
          end
        end
      end.compact
    end
        
  end
end