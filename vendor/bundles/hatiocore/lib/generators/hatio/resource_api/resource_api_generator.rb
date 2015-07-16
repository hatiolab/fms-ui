require 'generators/hatio/util/migration_util'
require 'generators/hatio/util/model_util'
require 'generators/hatio/util/api_util'

module Hatio
  module Generators
    class ResourceApiGenerator < Rails::Generators::NamedBase
  
      source_root File.expand_path('../templates', __FILE__)
      argument :model_attributes, :type => :array, :default => [], :banner => "model:attributes"
      class_option :domain, :type => :string, :default => '', :desc => "Domain Name"
      class_option :bundle, :type => :string, :default => '', :desc => "Bundle name"
      class_option :id_type, :type => :string, :default => "uuid", :description => "id type - uuid|meaningful|auto-increment|none"
      class_option :gen_type, :type => :string, :default => "all", :description => "gen type - all|model|none"
      class_option :use_attachment, :type => :string, :default => 'n', :desc => 'Use attachment or not'
      class_option :use_ext_prop, :type => :string, :default => 'n', :desc => 'Use extension properties or not'
      class_option :del_trace, :type => :string, :default => 'n', :desc => 'Deletion Trace'
      class_option :columns, :type => :string, :desc => 'Column informations'
  
      def generate_resource_api
    
        begin
          raise "Not allowed empty bundle name" if (!options.bundle || options.bundle.empty?)
          unless ['uuid', 'meaningful', 'auto-increment', 'none'].include?(options.id_type)
            raise "Invalid --id-type option [uuid|meaningful|auto-increment|none]" 
          end
          
          @id_type = options.id_type
          @bundle_name = options.bundle
          bundle_app_path = "vendor/bundles/#{@bundle_name}"
          controller_path = "#{bundle_app_path}/app/controllers"
          model_path = "#{bundle_app_path}/app/models"
          view_path = "#{bundle_app_path}/app/views/#{table_name}"
          migration_path = "#{bundle_app_path}/db/migrate"

          Domain.current_domain = Domain.find_by_name(options.domain)
          entity = Entity.find_by_name(class_name)
          @attributes = entity.entity_columns

          cols_str = options.columns
          cols_str.gsub!('~', '"')
          cols_str.gsub!('^', ',')
          col_infos = JSON.parse(cols_str)
          
          @attributes.each do |attr|
            col = col_infos.find { |col| col["id"].to_i == attr.id }
            if(col)
              attr.max = col["max"] if(col.key?("max") && attr.col_type == 'integer' || attr.col_type == 'float' || attr.col_type == 'decimal')
              attr.min = col["min"] if(col.key?("min") && attr.col_type == 'integer' || attr.col_type == 'float' || attr.col_type == 'decimal')
              attr.editable = col["editable"] if(col.key?("editable"))
              attr.trimable = col["trimable"] if(col.key?("trimable"))
              attr.search_rank = col["search_rank"] if(col.key?("search_rank"))
              attr.sort_rank = col["sort_rank"] if(col.key?("sort_rank"))
              attr.reverse_sort = col["reverse_sort"] if(col.key?("reverse_sort"))
            end
          end
          
          @common_attrs = ["id", "domain_id", "creator_id", "updater_id", "created_at", "updated_at"]
          @all_attrs = @attributes.map { |attr| ':' + attr.name }.join(',')
          @biz_attrs = @attributes.find_all { |attr| !@common_attrs.include?(attr.name) }
          
          if(options.gen_type == "all" || options.gen_type == "model")
            template "model.rb", "#{model_path}/#{singular_name}.rb"
            template "migration.rb", "#{migration_path}/#{Hatio::Generators::MigrationUtil.next_migration_number}_create_#{table_name}.rb"
          end
          
          if(options.gen_type == "all")
            template "controller.rb", "#{controller_path}/#{table_name}_controller.rb"
            
            view_dir = File.join(Rails.root, view_path)
            FileUtils.mkdir "#{view_dir}" unless File.exist?("#{view_dir}")
            
            template "index.json.jbuilder", "#{view_path}/index.json.jbuilder"
            template "show.json.jbuilder", "#{view_path}/show.json.jbuilder"
            template "create.json.jbuilder", "#{view_path}/create.json.jbuilder"
            template "update.json.jbuilder", "#{view_path}/update.json.jbuilder"
            
            inject_into_file "#{bundle_app_path}/config/routes.rb", :after => "# RESOURCES BEGIN BLOCK DON'T REMOVE" do
              "\n\tresources :#{table_name} do\n\t\tcollection do\n\t\t\tpost :update_multiple\n\t\t\tget :show_by_name\n\t\t\tget :export\n\t\tend\n\tend\n"
            end
          end
      
          puts "\nSuccess"
        rescue StandardError => e
          trace_str = e.backtrace[0 .. 5].join("\n")
          puts "\nError : #{e.to_s}\n#{trace_str}"
        end
      end
  
    end
  end
end
