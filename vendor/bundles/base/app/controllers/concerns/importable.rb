module Importable
  extend ActiveSupport::Concern
  
  def import_excel(domain, resource_class, file)
    spreadsheet = open_spreadsheet(file)
    import_svc = DiyService.find_by_name("Import#{resource_class.name}")
    if(import_svc)
      import_by_svc(domain, resource_class, spreadsheet, import_svc)
    else
      import_by_default(domain, resource_class, spreadsheet)
    end
  end
  
  #
  # DiyService로 임포트 
  #
  def import_by_svc(domain, resource_class, spreadsheet, import_svc)
    # header parsing - header는 반드시 1 라인에 있어야 함
    import_list, header = [], spreadsheet.row(1)
    begin
      (2..spreadsheet.last_row).each do |i|
        import_list << spreadsheet.row(i)
      end
      
      import_svc.execute_service({:header => header, :import_data => import_list})
    rescue Exception => e
      raise Hatio::Exception::InvalidRequest, e.to_s
    end
  end

  #
  # 기본 임포트 
  # 
  def import_by_default(domain, resource_class, spreadsheet)
    # header parsing - header는 반드시 1 라인에 있어야 함
    header = spreadsheet.row(1)
    entity = Entity.find_by_name(resource_class.to_s)
    raise Hatio::Exception::MisConfigured, (I18n.translate 'errors.messages.x_not_found', :x => "Entity (#{resource_class.to_s})") unless entity
    # entity_columns 정보 중에 list_rank가 설정된 것 들에 한해서만 처리한다.
    import_columns, import_data_list = entity.list_columns, []
    
    # data는 2 라인 부터 시작 
    (2..spreadsheet.last_row).each do |i|
      #row = Hash[[header, spreadsheet.row(i)].transpose] ==> hash
      row = spreadsheet.row(i) # ==> array
      next unless row[0]
      row_data = {}
      import_columns.each_with_index do |column, idx| 
        data = row[idx]
        data = convert_value_by_type(column, data)
        data.strip! if(data && data.respond_to?('strip'))
        row_data[column.name.downcase] = data unless(column.name == 'creator_id' || column.name == 'created_at' || column.name == 'updater_id' || column.name == 'updated_at')
      end
      import_data_list.push(row_data) unless row_data.empty?
    end
    
    return if(import_data_list.empty?)
    exe_list = []
    
    resource_class.transaction do
      import_data_list.each do |import_data|
        rsc = resource_class.where("name = ?", import_data['name']).first
        
        if(exe_list.include?(import_data['name']))
          # 있으면 스킵 
          debug_print "#{import_data['name']} skipped!"
          next
        else
          unless rsc
            rsc = resource_class.new 
            rsc.domain = domain
          end
        end
        
        import_data.each_key do |col_name|
          col_value = import_data["#{col_name}"]
          next if(col_value.nil? || col_value == '')
          import_column = import_columns.find { |import_column| import_column.name == col_name }
          next unless import_column
          
          # 1. 일반 데이터 타입일 경우
          if(!import_column.ref_type || import_column.ref_type.empty?)
            rsc["#{col_name}"] = col_value
          # 2. 엔티티 일 경우 처리 
          elsif(import_column.ref_type == 'Entity')
            # ref name으로 find_by_name으로 처리한다.
            entity_instance = import_column.ref_name.constantize.where("name = ?", col_value).first
            raise Hatio::Exception::MisConfigured, (I18n.translate 'errors.messages.x_not_found', :x => "Code (#{col_value})") unless entity_instance
            rsc["#{col_name}"] = entity_instance.id
          # 3. 코드일 경우 처리 
          elsif(import_column.ref_type == 'CommonCode')
            # ref name으로 코드에서 쿼리하여 name값을 가져온다.
            common_code = CommonCode.where("name = ? and parent_id is null", import_column.ref_name).first
            if(common_code)
              code = common_code.codes.find { |code| code.description == col_value }
              code = common_code.codes.find { |code| code.name == col_value } unless(code)
              rsc["#{col_name}"] = code.name if(code)
            else
              raise Hatio::Exception::MisConfigured, (I18n.t 'errors.messages.x_not_found', :x => "Code (#{col_value})")
            end
          end
        end

        begin
          rsc.save!
        rescue
          debug_print "Save Failed : #{rsc.inspect}"
        end
        exe_list.push(rsc.name)
      end
    end
  end
  
  #
  # column type별로 value를 변환한다.
  #
  def convert_value_by_type(column_info, col_value)
    # 타입별 처리 - boolean, date, number등 ...
    case column_info.col_type
      when "boolean"
        if(!col_value)
          return false
        else
          val = col_value.downcase
          return (val == 'true' || val == 't' || val == '1' || val == 'y' || val == 'on') ? true : false
        end
      when "integer"
        return col_value ? col_value.to_i : col_value
      when "float"
        return col_value ? col_value.to_f : col_value
      when "decimal"
        return col_value ? col_value.to_f : col_value
      when "string"
        if(col_value == nil)
          return nil
        else
          col_val = nil
          if(col_value.class.name == 'Float')
            col_val = col_value.to_i.to_s
          elsif(col_value.class.name == 'Fixnum')
            col_val = col_value.to_s
          else
            col_val = col_value.to_s
          end
          return col_val
        end            
      else
        return col_value
    end
  end
  
  #
  # open excel file
  #
  def open_spreadsheet(file)
    case File.extname(file.original_filename)
      when ".csv" then Csv.new(file.path, nil, :ignore)
      when ".xls" then Excel.new(file.path, nil, :ignore)
      when ".xlsx" then Roo::Excelx.new(file.path, nil, :ignore)
      else raise Hatio::Exception::InvalidRequest, (I18n.translate 'errors.messages.unknown_file_type')
    end
  end
  
end