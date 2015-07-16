module Hatio
  module Generators
    class MigrationUtil
  
      #
      # 입력한 attributes들로 부터 GeneratedAttribute를 생성하여 array로 리턴 
      #
      def self.generated_attributes(model_attributes)
        attrs = []
        model_attributes.each do |attribute|
          attrs << Rails::Generators::GeneratedAttribute.new(*attribute.split(":")) if attribute.include?(":")
        end
        return attrs
      end
  
      #
      # generate db migration file number 
      #
      def self.next_migration_number
        Time.now.utc.strftime("%Y%m%d%H%M%S")
      end
  
      #
      # id option str 
      #
      def self.id_option_str(id_type)
        if(id_type == 'auto-increment')
          return ''
        elsif(id_type == 'none')
          return ",:id => false"
        else
          return ",:id => :#{id_type}"
        end
      end
  
      #
      # 입력된 attributes로 부터 migration fields를 추가 
      #
      def self.add_migration_fields(attributes)
        output, userstampable, timestampable = "", false, false
    
        attributes.each do |attr|
          if (attr.name == 'id')
          elsif(attr.name == 'domain_id')
            output << "\t\t\tt.references :domain, :null => false\n"
          elsif(attr.name == 'creator_id' || attr.name == 'updater_id')
            userstampable = true
          elsif(attr.name == 'created_at' || attr.name == 'updated_at')
            timestampable = true
          elsif(attr.name == 'name')
            output << "\t\t\tt.references :name, :null => false, :limit => 64\n"
          else
            begin
              output << "\t\t\tt.#{attr.type} :#{attr.name}\n"
            rescue
              output << "\t\t\tt.#{attr.col_type} :#{attr.name}\n"
            end
          end
        end
    
        output << "\t\t\tt.userstamps\n" if userstampable
        output << "\t\t\tt.timestamps\n" if timestampable
        output
      end
  
      #
      # add migration index 
      #
      def self.add_migration_index(table_name, attributes)
        output, index_seq = "", 0
        domain_id_attr = attributes.find { |attr| attr.name == 'domain_id' }
        name_attr = attributes.find { |attr| attr.name == 'name' }
        updated_at_attr = attributes.find { |attr| attr.name == 'updated_at' }
        
        uniq_cols = attributes.select { |col| col.uniq_rank > 0 }.sort_by(&:uniq_rank)
        if(!uniq_cols.empty?)
          uniq_col_names = uniq_cols.map { |col| ":#{col.name}" }.join(",")
          output << "\t\tadd_index :#{table_name}, [#{uniq_col_names}], :unique => true, :name => :ix_#{table_name}_#{index_seq}\n"
          index_seq += 1
        end        
    
        if(domain_id_attr && updated_at_attr)
          output << "\t\tadd_index :#{table_name}, [:domain_id, :updated_at], :name => :ix_#{table_name}_#{index_seq}\n"
          index_seq += 1
        elsif(updated_at_attr)
          output << "\t\tadd_index :#{table_name}, [:updated_at], :name => :ix_#{table_name}_#{index_seq}\n"
          index_seq += 1
        end
    
        output
      end
  
      #
      # remove migration index 
      #
      def self.remove_migration_index(table_name, attributes)
        output, index_seq = "", 0
        domain_id_attr = attributes.find { |attr| attr.name == 'domain_id' }
        name_attr = attributes.find { |attr| attr.name == 'name' }
        updated_at_attr = attributes.find { |attr| attr.name == 'updated_at' }
        
        uniq_cols = attributes.select { |col| col.uniq_rank > 0 }.sort_by(&:uniq_rank)
        if(!uniq_cols.empty?)
          uniq_col_names = uniq_cols.map { |col| ":#{col.name}" }.join(",")
          output << "\t\tremove_index :#{table_name}, [#{uniq_col_names}], :unique => true, :name => :ix_#{table_name}_#{index_seq}\n"
          index_seq += 1
        end        
    
        if(domain_id_attr && updated_at_attr)
          output << "\t\tremove_index :#{table_name}, [:domain_id, :updated_at], :name => :ix_#{table_name}_#{index_seq}\n"
          index_seq += 1
        elsif(updated_at_attr)
          output << "\t\tremove_index :#{table_name}, [:updated_at], :name => :ix_#{table_name}_#{index_seq}\n"
          index_seq += 1
        end
    
        output
      end
  
      #
      # table migration 내용 생성 
      # 
      def self.create_table_migration(class_name, table_name, attributes, options, pk_col_name)
        id_option = self.id_option_str(options.id_type)
        id_option = ":id => false" if(pk_col_name && pk_col_name != 'id')

        output = "class Create#{class_name.pluralize} < ActiveRecord::Migration\n\n"
        output << "\tdef change\n"
        output << "\t\tcreate_table #{table_name.to_sym.inspect} #{id_option} do |t|\n"
        output << "#{Hatio::Generators::MigrationUtil.add_migration_columns(attributes, pk_col_name)}"
        output << "\t\tend\n\n"

        output << "#{MigrationUtil.add_migration_index(table_name, attributes)}"

        output << "\tend\n\n"
        output << "end\n"
        output
      end
  
      #
      # 입력된 attributes로 부터 migration fields를 추가, columns는 Entity의 Entity Columns
      #
      def self.add_migration_columns(columns, pk_col_name)
        output = ""
        userstampable, timestampable = false, false
    
        columns.each do |column|
          if(column.name == 'id')
          elsif(column.name == 'domain_id')
            output << "\t\t\tt.references :domain, :null => false\n"
          elsif(column.name == 'created_at' || column.name == 'updated_at')
            timestampable = true
          elsif(column.name == 'creator_id' || column.name == 'updater_id')
            userstampable = true
          elsif(column.ref_type == "Entity")
            if(column.name.ends_with?("_id"))
              ref_name = column.name[0 .. column.name.rindex('_') - 1]
              output << "\t\t\tt.references :#{ref_name}\n"
            else
              output << "\t\t\tt.#{column.col_type} :#{column.name}\n"
            end
          else
            output << "\t\t\tt.#{column.col_type} :#{column.name}"
            output << ", :null => false" if(!column.nullable.nil? && !column.nullable)
            output << ", :limit => #{column.col_size}" if(column.col_type == 'string' && column.col_size && column.col_size > 0)
            output << ", :default => #{column.def_val}" if(column.def_val && !column.def_val.empty?)
            output << "\n"
          end
        end
    
        output << "\t\t\tt.userstamps\n" if userstampable
        output << "\t\t\tt.timestamps\n" if timestampable
        output
      end
  
    end
  end
end
