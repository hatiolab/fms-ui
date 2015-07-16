module Hatio
  module Generators
    class ViewUtil
  
      # 
      # columns 정보로 부터 그리드를 생성 
      #   
      def self.generate_grid(singularName, columns, options, indent)
        output = "columns : [\n"
        indent = "\t\t" unless indent

    		output << "#{indent}{ dataIndex : '_cud_flag_', hidden : true,  value : '' },\n"
		
        columns.each do |col|
          if(col.name == 'id')
            output << "#{indent}{ header : T('label.id'), dataIndex : 'id', hidden : true },\n"
          elsif(col.name == 'name')
            output << "#{indent}{ header : T('label.name'), dataIndex : 'name', editor : { xtype : 'textfield', allowBlank : false } },\n"
          elsif(col.name == 'description')
            output << "#{indent}{ header : T('label.description'), dataIndex : 'description', editor : { xtype : 'textfield', allowBlank : true } },\n"
          elsif(col.name == 'domain_id' || col.name == 'creator_id' || col.name == 'updater_id')
            output << "#{indent}{ dataIndex : '#{col.name}',  hidden : true },\n"
          elsif(col.name == 'created_at' || col.name == 'updated_at')
            output << "#{indent}{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', xtype : 'datecolumn', disabled : true, format : T('format.datetime') },\n"
          else
            if(col.type == :string)
              output << "#{indent}{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', editor : { xtype : 'textfield' } },\n"
            elsif(col.type == :text)
              output << "#{indent}{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', editor : { xtype : 'textareafield' } },\n"
            elsif(col.type == :boolean)
              output << "#{indent}{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', xtype : 'checkcolumn' },\n"
            elsif(col.type == :date)
              output << "#{indent}{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', editor : { xtype : 'datefield', format : T('format.date') } },\n"
            elsif(col.type == :datetime)
              output << "#{indent}{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', editor : { xtype : 'datefield', format : T('format.datetime') } },\n"
            elsif(col.type == :integer || col.type == :float || col.type == :long || col.type == :double)
              output << "#{indent}{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', editor : { xtype : 'numberfield' } },\n"
            else
            end
          end
        end

        output << "#{indent}],\n"
        output
      end
  
      # 
      # resource의 columns로 부터 form 정보를 생성하여 리턴 
      #   
      def self.generate_form(resourceName, columns, options, indent)
        output = ""
        indent = "\t\t" unless indent

        columns.each do |col|

          if(col.name == 'id')
            output << "#{indent}{ name : 'id', fieldLabel : T('label.id'), hidden : true },\n"
          elsif(col.name == 'domain_id')
            output << "#{indent}{ name : 'domain_id', value : login.current_domain_id, hidden : true },\n"
          elsif(col.name == 'creator_id' || col.name == 'updater_id')
            # skip
          elsif(col.name == 'created_at' || col.name == 'updated_at')
            output << "#{indent}{ xtype : 'datefield', name : '#{col.name}', disabled : true, fieldLabel : T('label.#{col.name}'), format : T('format.datetime') },\n"
          elsif(col.name == 'image_data')
            output << "#{indent}{ id : '#{resourceName}-image-upload', itemId : '#{resourceName}-image-upload', xtype : 'fileuploadfield', inputType : 'file', name : 'image_upload', fieldLabel : T('label.image') }, \n"
            output << "#{indent}{ xtype : 'textareafield', name : '#{col.name}', fieldLabel : T('label.data'), rows : 16, readOnly : true }, \n"
          else
            if(col.type == :string)
              output << "#{indent}{ name : '#{col.name}', fieldLabel : T('label.#{col.name}') },\n"
            elsif(col.type == :text)
              output << "#{indent}{ xtype : 'textareafield', name : '#{col.name}', fieldLabel : T('label.#{col.name}') }, \n"
            elsif(col.type == :boolean)
              output << "#{indent}{ name : '#{col.name}', fieldLabel : T('label.#{col.name}'), xtype : 'checkboxfield', inputValue : true },\n"
            elsif(col.type == :date)
              output << "#{indent}{ xtype : 'datefield', name : '#{col.name}', disabled : true, fieldLabel : T('label.#{col.name}'), format : T('format.date') },\n"
            elsif(col.type == :datetime)
              output << "#{indent}{ xtype : 'datefield', name : '#{col.name}', disabled : true, fieldLabel : T('label.#{col.name}'), format : T('format.datetime') },\n"
            elsif(col.type == :integer || col.type == :float || col.type == :long || col.type == :double)
              output << "#{indent}{ name : '#{col.name}', fieldLabel : T('label.#{col.name}'), xtype : 'numberfield' },\n"
            else
            end
          end
        end

        output
      end

      # 
      # columns 정보로 부터 search condition items를 생성 
      #   
      def self.generate_search_items(resourceName, columns, options, indent)
        output = "items : [ \n"
        indent = "\t\t" unless indent
		
        columns.each do |col|
          if(col.name == 'id' || col.name == 'domain_id' || col.name == 'creator_id' || col.name == 'updater_id')
          elsif(col.name == 'created_at' || col.name == 'updated_at')
            #output << "#{indent}{ fieldLabel : T('label.#{col.name}_from'), name : '#{col.name}-gte', xtype : 'datefield', format : T('format.date') },\n"
            #output << "#{indent}{ fieldLabel : T('label.#{col.name}_to'), name : '#{col.name}-lte', xtype : 'datefield', format : T('format.date') },\n"
          else
            if(col.type == :string || col.type == :text)
              output << "#{indent}{ fieldLabel : T('label.#{col.name}'), name : '#{col.name}-like' },\n"
            elsif(col.type == :boolean)
              output << "#{indent}{ fieldLabel : T('label.#{col.name}'), name : '#{col.name}-eq', inputValue : true, xtype : 'checkboxfield', inputValue : true },\n"
            elsif(col.type == :date)
              output << "#{indent}{ fieldLabel : T('label.#{col.name}_from'), name : '#{col.name}-gte', xtype : 'datefield', format : T('format.date') },\n"
              output << "#{indent}{ fieldLabel : T('label.#{col.name}_to'), name : '#{col.name}-lte', xtype : 'datefield', format : T('format.date') },\n"
            elsif(col.type == :datetime)
              output << "#{indent}{ fieldLabel : T('label.#{col.name}_from'), name : '#{col.name}-gte', xtype : 'datefield', format : T('format.datetime') },\n"
              output << "#{indent}{ fieldLabel : T('label.#{col.name}_to'), name : '#{col.name}-lte', xtype : 'datefield', format : T('format.datetime') },\n"
            elsif(col.type == :integer || col.type == :float || col.type == :long || col.type == :double)
              output << "#{indent}{ fieldLabel : T('label.#{col.name}'), name : '#{col.name}-eq', xtype : 'numberfield' },\n"
            else
            end
          end
        end
    
        output << "#{indent}],\n"
        output
      end
  
      # 
      # columns 정보로 부터 store filter 코드 생성 
      #
      def self.generateStoreFilter(resourceName, columns, options, indent)
        indent = "\t\t" unless indent
        output = "store.filter([ {\n"
        output << "#{indent}#{indent}property : 'domain_id-eq',\n"
        output << "#{indent}#{indent}value : login.current_domain_id\n"
        output << "#{indent}}, \n"
		
        columns.each do |col|
          if(col.name == 'id' || col.name == 'domain_id' || col.name == 'creator_id' || col.name == 'updater_id' || col.name == 'created_at' || col.name == 'updated_at')
          elsif(col.name.end_with?('_id'))
            output << "#{indent}{ \n"
            output << "#{indent}#{indent}property : '#{col.name}-eq',\n"
            output << "#{indent}#{indent}value : this.findItem(' \##{col.name}_filter').getValue()\n"
            output << "#{indent}},\n"
          else
            if(col.type == :string || col.type == :text)
              output << "#{indent}{ \n"
              output << "#{indent}#{indent}property : '#{col.name}-like',\n"
              output << "#{indent}#{indent}value : this.findItem(' \##{col.name}_filter').getValue()\n"
              output << "#{indent}},\n"
            elsif(col.type == :date || col.type == :datetime)
              output << "#{indent}{ \n"
              output << "#{indent}#{indent}property : '#{col.name}-gte',\n"
              output << "#{indent}#{indent}value : this.findItem(' \##{col.name}_from_filter').getValue()\n"
              output << "#{indent}},\n"
              output << "#{indent}{ \n"
              output << "#{indent}#{indent}property : '#{col.name}-lte',\n"
              output << "#{indent}#{indent}value : this.findItem(' \##{col.name}_to_filter').getValue()\n"
              output << "#{indent}},\n"
            elsif(col.type == :boolean || col.type == :integer || col.type == :float || col.type == :long || col.type == :double)
              output << "#{indent}{ \n"
              output << "#{indent}#{indent}property : '#{col.name}-eq',\n"
              output << "#{indent}#{indent}value : this.findItem(' \##{col.name}_filter').getValue()\n"
              output << "#{indent}},\n"
            else
            end
          end
        end
    
        output << "#{indent}]);\n"
        output
      end
  
      # 
      # columns 정보로 부터 search filter를 리셋 
      #
      def self.generateResetFilters(resourceName, columns, options, indent)
        indent = "\t\t" unless indent
    		output = ""
		
        columns.each do |col|
          if(col.name == 'id' || col.name == 'domain_id' || col.name == 'creator_id' || col.name == 'updater_id' || col.name == 'created_at' || col.name == 'updated_at')
          else
            if(col.type == :string || col.type == :text)
              output << "#{indent}this.findItem(' \##{col.name}_filter').setValue('');\n";
            elsif(col.type == :date || col.type == :datetime)
              output << "#{indent}this.findItem(' \##{col.name}_filter').setValue('');\n";
            elsif(col.type == :boolean || col.type == :integer || col.type == :float || col.type == :long || col.type == :double)
              output << "#{indent}this.findItem(' \##{col.name}_filter').setValue(false);\n";
            else
            end
          end
        end
    
        output
      end
  
      # 
      # 새로운 model 생성 
      #
      def self.generateNewModel(resourceName, columns, options, indent)
        indent = "\t" unless indent
        output = "data = data || {\n"
        output << "#{indent}#{indent}#{indent}domain_id : login.current_domain_id,\n"
    
        columns.each do |col|
          if(col.name == 'domain_id' || col.name == 'creator_id' || col.name == 'updater_id' || col.name == 'created_at' || col.name == 'updated_at')
          else
            output << "#{indent}#{indent}#{indent}#{col.name} : '',\n"
          end
        end
        output << "#{indent}#{indent}#{indent}_cud_flag_ : 'c'};\n"    
        output << "#{indent}#{indent}return Ext.create('#{options.bundle}.model.#{resourceName}', data);"
        output
      end
  
    end
    
  end
end
