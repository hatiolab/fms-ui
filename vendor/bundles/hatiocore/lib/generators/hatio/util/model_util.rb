module Hatio
  module Generators
    class ModelUtil
  
      #
      # 모델 정보를 생성하여 리턴 
      #
      def self.generate_model(options, attributes, biz_attrs)
        output, creator_flag, updater_flag, created_at_flag, updated_at_flag, name_flag, domain_flag = "\n", false, false, false, false, false, false
        attributes.each do |attr|
          case attr.name
            when 'name'
              name_flag = true
            when 'domain_id'
              domain_flag = true
            when 'creator_id'
              creator_flag = true
            when 'updater_id'
              updater_flag = true
            when 'created_at'
              created_at_flag = true
            when 'updated_at'
              updated_at_flag = true
            else
          end
        end
    
        output << "\tinclude Multitenant\n\n" if(domain_flag)
        output << "\tinclude Attachable\n\n" if(options.use_attachment == 'y')
        output << "\tinclude PropertyKeepable\n\n" if(options.use_ext_prop == 'y')
        output << "\tstampable\n\n" if(created_at_flag || creator_flag)
        output << "\tremoving_trackable\n\n" if(options.del_trace == 'y')
        
        trim_cols = biz_attrs.select { |attr| attr.trimable }
        if(!trim_cols.empty?)
          trim_names = trim_cols.map { |col| ":#{col.name}" }.join(",")
          output << "\tstrip_cols [#{trim_names}]\n\n"
        end

        # output << "meaningful_id [:domain_id, :name]\n\t" if(options.id_type == 'meaningful' && domain_flag && name_flag)
        # output << "universal_unique_id\n\t" if(options.id_type == 'uuid')

        presence_cols = biz_attrs.find_all { |col| col.nullable.nil? || !col.nullable }
        presence_col_names = presence_cols.empty? ? "" : presence_cols.collect { |col| ":#{col.name}" }.join(",")
        output << "\tvalidates_presence_of #{presence_col_names}, :strict => true\n\n" unless(presence_col_names.empty?)
                  
        biz_attrs.each do |col|
          output << "\tvalidates :#{col.name}, length: { maximum: #{col.col_size} }, :strict => true\n\n" if(col.col_type == 'string' && col.col_size && col.col_size > 0)
        end
        
        uniq_cols = attributes.select { |col| col.uniq_rank > 0 }.sort_by(&:uniq_rank)
        if(!uniq_cols.empty?)
          uniq_name = uniq_cols.pop.name
          uniq_output = "\tvalidates_uniqueness_of :#{uniq_name}, :strict => true"
          if(!uniq_cols.empty?)
            scope_name = uniq_cols.map { |col| ":#{col.name}" }.join(",")
            uniq_output << ", :scope => [#{scope_name}]\n\n"
          end
          output << uniq_output
        end
        
        # console에서 명령 내린 경우가 아니면 ...
        if(attributes[0].class.name != "Rails::Generators::GeneratedAttribute")
          belong_to_arr = biz_attrs.find_all { |attr| attr.ref_type == :Entity.to_s && attr.ref_name }
          belong_to_arr.each do |belongs_to|
            entity_name = belongs_to.ref_name
            entity_class = entity_name.constantize
            output << "\tbelongs_to :#{entity_name.underscore}\n"
          end
        end
        
        output
      end

    end
  end
end
