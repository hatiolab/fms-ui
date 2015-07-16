module Hatio
  module Generators
    class ResourceViewUtil
  
      DATA_TYPE_NUMBER = ['integer', 'float', 'long', 'double', 'decimal']
      DATA_TYPE_DATE = ['date', 'datetime', 'timestamp']
      DATA_TYPE_TEXT = ['string', 'text']
      SKIP_COLUMN_NAME = ['id', 'domain_id', 'creator_id', 'updater_id', 'created_at', 'updated_at', 'deleted_at', 'version']

      # 
      # columns 정보로 부터 그리드를 생성 
      #   
      def self.generate_grid(domain, singular_name, columns, options, indent)
        output = "columns : [\n"
        indent = "\t\t" unless indent
        
        if('y' == options.use_ext_prop)
          output << "#{indent}{ xtype : 'actioncolumn', icon : 'assets/std/iconSlideshow.png', itemId : 'slideshow', width : 30, align : 'center' },\n"
        end
    
        columns.each do |col|
          col_info = ""
          
          if(col.name == 'id')
              col_info = "{ header : T('label.id'), dataIndex : 'id', hidden : true }"
          elsif(col.name == 'domain_id')
            next
          else
            # list_rank가 0보다 큰 경우만 grid에 표시
            if((col.list_rank && col.list_rank > 0) || (col.sort_rank && col.sort_rank > 0))
              # 기본 생성, 수정시간 필드는 무조건 disabled 처리 
              if(col.name == 'created_at' || col.name == 'updated_at')
                col_info = "{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', xtype : 'datecolumn', format : T('format.datetime'), width : 120 }"
              # reference 인 경우는 해당 reference에 맞게 처리 
              elsif(col.ref_type && !col.ref_type.empty?)
                col_info = self.get_grid_column_by_ref(domain, col)
              # 일반적인 필드인 경우
              else
                col_info = self.get_grid_column(domain, col)
              end
            end
          end
      
          output << "#{indent}#{col_info},\n" unless(col_info.empty?)
        end

        output << "\t],"
        output
      end
  
      #
      # grid column 정보에 sort option을 추가한다.
      #  
      def self.grid_sort_option(columns, indent)
        sort_columns = columns.select{ |f| f.sort_rank && f.sort_rank > 0 }.sort_by(&:sort_rank)
        column_info = ""
        
        if(!sort_columns.empty?)
          column_info << "#{indent}sorters : [\n"
          sort_columns.each do |scol| 
            dir = scol.reverse_sort ? 'desc' : 'asc'
            column_info << "#{indent}\t{ property : '#{scol.name}', direction : '#{dir}' },\n" 
          end
          column_info << "#{indent}],"
        end
        
        column_info
      end
  
      # 
      # column의 reference type정보로 부터 grid column 정보를 얻는다.
      #
      def self.get_grid_column_by_ref(domain, column)
        columnInfo = ""
        if(column.ref_type == 'CommonCode')
          columnInfo << "{ header : T('label.#{column.name}'), dataIndex : '#{column.name}'"
          columnInfo << ", editor : { xtype : 'codecombo', commonCode : '#{column.ref_name}' }" if(column.editable)
          columnInfo << " }"
        elsif(column.ref_type == 'Entity')
          if(column.name.end_with?('_id') && column.ref_name)
            data_index = column.name[0 .. column.name.rindex('_') - 1]
            storeName = find_store_name(domain, column, data_index)
            columnInfo << "{ header : #{storeName[0]}, dataIndex : '#{data_index}', xtype : 'entitycolumn'"
            columnInfo << ", editor : { xtype : 'entitycolumneditor', storeClass : '#{storeName[1]}' }"  if(column.editable)
            columnInfo << " }"
          else
            columnInfo << get_grid_column(domain, column)
          end
        else
          columnInfo << get_grid_column(domain, column)
        end
        columnInfo
      end
  
      #
      # entity name으로 store명을 추출 
      #
      def self.find_store_name(domain, column, data_index)
        entity = Entity.find_by_name(column.ref_name);
    
        if(SKIP_COLUMN_NAME.include?(column.name))
          title = "T('label.#{data_index ? data_index : column.name}')"
        else
          title = data_index ? "T('label.#{data_index}')" : "T('label.#{column.name}')";
        end
    
        ["#{title}", "#{entity.bundle.camelcase}.store.#{entity.name}"]
      end
  
      # 
      # column으로 부터 grid column 정보를 얻는다.
      #
      def self.get_grid_column(domain, col)
        output, col_type = "", col.col_type
        
        if(col_type == 'string')
          output = "{ header : T('label.#{col.name}'), dataIndex : '#{col.name}' "
          output << grid_column_editor(col) if(col.editable)
          output << " }"
        elsif(col_type == 'text')
          output = "{ header : T('label.#{col.name}'), dataIndex : '#{col.name}' "
          output << grid_column_editor(col) if(col.editable)
          output << " }"
        elsif(col_type == 'boolean')
          output = "{ header : T('label.#{col.name}'), dataIndex : '#{col.name}' "
          output << ", xtype : 'checkcolumn' "
          output << " }"
        elsif(col_type == 'date')
          if(col.editable)
            output = grid_column_editor(col) if(col.editable)
          else
            output = "{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', xtype : 'datecolumn', format : T('format.date') }"
          end
        elsif(col_type == 'datetime' || col_type == 'timestamp')
          if(col.editable)
            output = grid_column_editor(col) if(col.editable)
          else
            output = "{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', xtype : 'datecolumn', format : T('format.datetime') }"
          end
        elsif(checkNumberColumn(col_type))
          output = "{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', align : 'right' "
          output << grid_column_editor(col) if(col.editable)
          output << " }"
        end
        
        return output
      end
      
      def self.grid_column_editor(col)
        col_type, output = col.col_type, ""
        
        if(col_type == 'string' || col_type == 'text')
          output << ", editor : { xtype : 'textfield' "
        elsif(col_type == 'date')
          output = "{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', xtype : 'datecolumn', format : T('format.date'), editor : { xtype : 'datefield', format : T('format.date') } }"
        elsif(col_type == 'datetime' || col_type == 'timestamp')
          output = "{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', editor : { xtype : 'datefield', format : T('format.datetime') } }"
        elsif(checkNumberColumn(col_type))
          output << ", editor : { xtype : 'numberfield' "
        end
        
        if(col_type == 'string' || col_type == 'text')
          output << ", maxLength : #{col.col_size} " if(col.col_size > 0)
        end
        
        if(checkNumberColumn(col_type))
          output << ", minValue : #{col.min} " if(!col.min.nil?)
          output << ", maxValue : #{col.max} " if(!col.max.nil?)
        end
        
        output << "}" if(col_type == 'string' || col_type == 'text')
        output << "}" if(checkNumberColumn(col_type))
        output
      end
  
      # 
      # resource의 columns로 부터 form 정보를 생성하여 리턴 
      #   
      def self.generate_form(domain, resourceName, columns, options, indent)
        output = "items : [\n\t"
        indent = "\t" unless indent

        columns.each do |col|
          columnInfo = ""
          if(col.name == 'id')
            columnInfo = "{ name : '#{col.name}', fieldLabel : T('label.#{col.name}'), hidden : true }"
          elsif(col.name == 'domain_id')
          elsif(col.name == 'creator_id' || col.name == 'updater_id' || col.name == 'created_at' || col.name == 'updated_at')
          elsif(col.ref_type && !col.ref_type.empty?)
            columnInfo = self.get_form_column_by_ref(domain, col)
          else
            columnInfo = self.get_form_column(domain, col)
          end
          output << "\t#{columnInfo},\n\t" if columnInfo && !columnInfo.empty?
        end

        output << "\t{ xtype : 'timestamp' }\n\t]"
        output
      end
  
      # 
      # column의 reference type정보로 부터 form column 정보를 얻는다.
      #
      def self.get_form_column_by_ref(domain, col)
        if(col.ref_type == 'CommonCode')
          return "{ name : '#{col.name}', fieldLabel : T('label.#{col.name}'), xtype : 'codefield', commonCode : '#{col.ref_name}' }"
        elsif(col.ref_type == 'Entity')
          entity_name = col.name[0 .. col.name.rindex('_') - 1]
          storeName = find_store_name(domain, col, entity_name)
          return "{ name : '#{entity_name}', fieldLabel : #{storeName[0]}, xtype : 'entityfield', storeClass : '#{storeName[1]}' }"
        else
          return ""
        end
      end
  
      # 
      # column으로 부터 form column 정보를 얻는다.
      #
      def self.get_form_column(domain, col)
        col_type = col.col_type
        if(col_type == 'string')
          allow_blank_str = (!col.nullable.nil? && !col.nullable) ? ", allowBlank : false" : ""
          col_size_str = (col.col_size && col.col_size > 0) ? ", maxLength : #{col.col_size}" : ""
          "{ name : '#{col.name}', fieldLabel : T('label.#{col.name}')#{allow_blank_str}#{col_size_str} }"
        elsif(col_type == 'text')
          allow_blank_str = (!col.nullable.nil? && !col.nullable) ? ", allowBlank : false" : ""
          col_size_str = (col.col_size && col.col_size > 0) ? ", maxLength : #{col.col_size}" : ""
          "{ name : '#{col.name}', fieldLabel : T('label.#{col.name}'), xtype : 'textareafield'#{allow_blank_str}#{col_size_str} }"
        elsif(col_type == 'boolean')
          "{ name : '#{col.name}', fieldLabel : T('label.#{col.name}'), xtype : 'checkboxfield', inputValue : true }"
        elsif(col_type == 'date')
          "{ name : '#{col.name}', fieldLabel : T('label.#{col.name}'), xtype : 'datefield', format : T('format.date'), submitFormat : T('format.submitDate') }"
        elsif(col_type == 'datetime' || col_type == 'timestamp')
          "{ name : '#{col.name}', fieldLabel : T('label.#{col.name}'), xtype : 'datefield', format : T('format.datetime') }"
        elsif(checkNumberColumn(col_type))
          min_val_str = col.min.nil? ? "" : ", minValue : #{col.min}"
          max_val_str = col.max.nil? ? "" : ", maxValue : #{col.max}"
          "{ name : '#{col.name}', fieldLabel : T('label.#{col.name}'), xtype : 'numberfield'#{min_val_str}#{max_val_str} }"
        else
          ""
        end
      end

      # 
      # columns 정보로 부터 search condition items를 생성 
      #   
      def self.generate_search_items(domain, resourceName, columns, options, indent)
        output = "items : [\n"
        indent = "\t\t" unless indent
        search_columns = columns.select { |c| c.search_rank && c.search_rank > 0 }.sort_by(&:search_rank)
        
        search_columns.each do |col|
          if(!self.checkSkipColumn(col))
            if(col.ref_type && !col.ref_type.empty?)
              columnInfo = self.get_search_form_column_by_ref(domain, col)
            else
              columnInfo = self.get_search_form_column(domain, col)
            end
            output << "#{indent}\t#{columnInfo},\n" if columnInfo && !columnInfo.empty?
          end
        end
    
        output << "#{indent}]"
        output
      end
  
      # 
      # column의 reference type정보로 부터 search form column 정보를 얻는다.
      #
      def self.get_search_form_column_by_ref(domain, col)
        if(col.ref_type == 'CommonCode')
          return "{ name : '#{col.name}-eq', fieldLabel : T('label.#{col.name}'), xtype : 'codesearchcombo', commonCode : '#{col.ref_name}', valueField : 'name', displayField : 'name' }"
        elsif(col.ref_type == 'Entity')
          data_label = col.name[0 .. col.name.rindex('_') - 1]
          storeName = find_store_name(domain, col, data_label)
          return "{ name : '#{data_label}.name-eq', fieldLabel : #{storeName[0]}, xtype : 'entitysearchcombo', storeClass : '#{storeName[1]}', valueField : 'name' }"
        else
          return ""
        end
      end
  
      # 
      # column의 정보로 부터 search form column 정보를 얻는다.
      #
      def self.get_search_form_column(domain, col)
        col_type = col.col_type
        if(col.name.end_with?('_yn'))
          return "{ name : '#{col.name}-eq', fieldLabel : T('label.#{col.name}'), xtype : 'yesnopicker' }"
        elsif(checkTextColumn(col_type))
          return "{ name : '#{col.name}-like', fieldLabel : T('label.#{col.name}')}"
        elsif(col_type == 'boolean')
          return "{ name : '#{col.name}-eq', fieldLabel : T('label.#{col.name}'), xtype : 'checkboxfield', inputValue : true }"
        elsif(col_type == 'date')
          return "{ name : '#{col.name}-eq', fieldLabel : T('label.date'), xtype : 'datefield', format : T('format.date'), submitFormat : T('format.submitDate') }"
        elsif(col_type == 'datetime' || col_type == 'timestamp')
          output = "{ name : '#{col.name}-gte', fieldLabel : T('label.#{col.name}_from'), xtype : 'datefield', format : T('format.datetime') },\n"
          output << "{ name : '#{col.name}-lte', fieldLabel : T('label.#{col.name}_to'), xtype : 'datefield', format : T('format.datetime') }"
          return output
        elsif(checkNumberColumn(col_type))
          return "{ name : '#{col.name}-eq', fieldLabel : T('label.#{col.name}'), xtype : 'numberfield' }"
        else
          return ""
        end
      end
  
      # 
      # columns 정보로 부터 model fields 정보를 설정  
      #
      def self.generate_model_fields(options, columns, indent)
        indent = "\t\t" unless indent
        validations, output = [], "fields : [\n"
        
        columns.each do |col|
          next if(col.name == 'domain_id')
          output << "#{indent}{ name : '#{col.name}', type : '"
          output << ((col.col_type == 'datetime' || col.col_type == 'timestamp') ? 'date' : col.col_type)
          output << "' },\n"
          
          # ref_type이 Entity이고 ref_name이 _id로 끝나면 ....
          if(col.ref_type && col.ref_type == 'Entity' && col.ref_name)
            if(col.name == 'creator_id')
              output << "#{indent}{ name : 'creator', type : 'auto' },\n"
            elsif(col.name == 'updater_id')
              output << "#{indent}{ name : 'updater', type : 'auto' },\n"
            else
              output << "#{indent}{ name : '#{col.ref_name.underscore}', type : 'auto' },\n"
            end
          end

          unless(SKIP_COLUMN_NAME.include?(col.name))
            if(!col.nullable.nil? && !col.nullable)
              validations << "#{indent}{ type : 'presence', field : '#{col.name}' },\n"
            end
          
            if(col.col_type && (col.col_size && col.col_size > 0))
              validations << "#{indent}{ type : 'length', field : '#{col.name}', max : #{col.col_size} },\n"
            end
          end
        end

        output << "#{indent}{ name : 'properties_attributes', type : 'auto', defaultValue : [] },\n" if('y' == options.use_ext_prop)
        output << "#{indent}{ name : '_cud_flag_', type : 'string' }\n\t]"

        unless(validations.empty?)
          output << ",\n\n\tvalidations : [\n"
          validations.each { |val| output << val }
          output << "\t]"
        end

        output
      end
  
      # 
      # 처리를 skip할 columns 정보인지 체크 
      #
      def self.checkSkipColumn(col)
        return SKIP_COLUMN_NAME.include?(col.name) ? true : false
      end
  
      # 
      # number형 컬럼인지 체크 
      #
      def self.checkNumberColumn(col_type)
        return DATA_TYPE_NUMBER.include?(col_type) ? true : false
      end
  
      # 
      # 문자형 컬럼인지 체크 
      #
      def self.checkTextColumn(col_type)
        return DATA_TYPE_TEXT.include?(col_type) ? true : false
      end
  
      # 
      # 날짜형 컬럼인지 체크 
      #
      def self.checkDateColumn(col_type)
        return DATA_TYPE_DATE.include?(col_type) ? true : false
      end
    end
    
  end
end