module Hatio
  module Generators
    class ApiUtil
      #
      # index template 생성 
      #
      def self.generate_index_template(singular_name, columns)
        output = "json.items do |json|\n"
        output << "\tjson.array!(@collection) do |#{singular_name}|\n"
        output << generate_index_json_builder(singular_name, columns)
        ref_columns = columns.select { |column| column.name != 'domain_id' && column.ref_type == 'Entity' && column.ref_name }
    
        ref_columns.each do |ref_column|
          next if (!ref_column.list_rank || ref_column.list_rank <= 0)
          ref_singular_name = ref_column.ref_name.underscore
      
          if(ref_column.name == 'creator_id')        
            output << "\n\t\tjson.creator do"
            output << "\n\t\t\tjson.id #{singular_name}.creator_id"
            output << "\n\t\t\tjson.name #{singular_name}.creator ? #{singular_name}.creator.name : ''"
            output << "\n\t\tend\n"
          elsif(ref_column.name == 'updater_id')
            output << "\n\t\tjson.updater do"
            output << "\n\t\t\tjson.id #{singular_name}.updater_id"
            output << "\n\t\t\tjson.name #{singular_name}.updater ? #{singular_name}.updater.name : ''"
            output << "\n\t\tend\n"
          elsif(ref_column.name.ends_with?('_id'))
            output << "\n\t\tjson.#{ref_singular_name} do"
            output << "\n\t\t\tjson.id #{singular_name}.#{ref_column.name}"
            output << "\n\t\t\tjson.name #{singular_name}.#{ref_singular_name} ? #{singular_name}.#{ref_singular_name}.name : ''"
            output << "\n\t\tend\n"
          end
        end
    
        output << "\tend\n"
        output << "end\n"
        output << "json.total @total_count\n"
        output << "json.success true\n"
        output
      end
  
      #
      # create, update.json.jbuilder 에서 사용할 json builder
      #
      def self.generate_single_json_builder(singular_name, all_attrs)
        all_col_str = all_attrs.map { |col| ":#{col.name}" }.join(",")
        "json.(@#{singular_name}, #{all_col_str})"
      end
      
      #
      # show.jbuilder 에서 사용할 json builder
      #
      def self.generate_show_json_builder(singular_name, all_attrs)
        all_col_str = all_attrs.find_all { |col| (col.name != 'creator_id' && col.name != 'updater_id') }.map { |col| ":#{col.name}" }.join(",")
        "json.(@#{singular_name}, #{all_col_str})"
      end
      
      #
      # show.jbuilder 에서 사용할 userstamp용 json builder
      #
      def self.generate_userstamp_json_builder(singular_name, all_attrs)
        output = "json.creator @#{singular_name}.creator, :id, :name if @#{singular_name}.creator\n"
        output << "json.updater @#{singular_name}.updater, :id, :name if @#{singular_name}.updater"
        output
      end
  
      #
      # index.jbuilder 에서 사용할 json builder
      #
      def self.generate_index_json_builder(singular_name, all_attrs)
        all_col_str = all_attrs.map { |col| ":#{col.name}" }.join(",")
        "json.(#{singular_name}, #{all_col_str})\n"
      end
      
      #
      # show.jbuilder 에서 사용, entity reference type인 경우 
      #
      def self.generate_ref_entity_json_builder(singular_name, biz_attrs)
        ref_columns, output = biz_attrs.select { |col| col.ref_type == 'Entity' && col.ref_name }, ""
        ref_columns.each do |ref_column|
          next if (!ref_column.list_rank || ref_column.list_rank <= 0)
          ref_singular_name = ref_column.ref_name.underscore
          ref_class = ref_column.ref_name.constantize
          output << "\njson.#{ref_singular_name} do"
          output << "\n\tjson.id @#{singular_name}.#{ref_column.name}"
          output << "\n\tjson.name @#{singular_name}.#{ref_singular_name} ? @#{singular_name}.#{ref_singular_name}.name : ''"
          if(ref_class.column_names.include?("description"))
            output << "\n\tjson.description @#{singular_name}.#{ref_singular_name} ? @#{singular_name}.#{ref_singular_name}.description : ''"
          end
          output << "\nend\n"
        end
        output
      end
  
    end
  end
end