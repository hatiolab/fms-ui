require 'generators/hatio/util/migration_util'
require 'generators/hatio/util/model_util'
require 'generators/hatio/util/resource_view_util'
require 'generators/hatio/util/report_view_util'

module Hatio
  module Generators
    class ResourceModelGenerator < Rails::Generators::NamedBase
  
      source_root File.expand_path('../templates', __FILE__)
      argument :model_attributes, type: :array, default: [], banner: "model:attributes"
      class_option :bundle, :type => :string, :default => '', :desc => "Bundle name"
      class_option :id_type, :type => :string, default: "none", :description => "id type - uuid|meaningful|auto-increment|none"
  
      def generate_model
        begin
          raise "Not allowed empty bundle name" if (!options.bundle || options.bundle.empty?)
          unless ['uuid', 'meaningful', 'auto-increment', 'none'].include?(options.id_type)
            raise "Invalid --id-type option [uuid|meaningful|auto-increment|none]" 
          end
              
          @id_type = options.id_type      
          @bundle_name = options.bundle
          bundle_app_path = "vendor/bundles/#{@bundle_name}"
          model_path = "#{bundle_app_path}/app/models"
          migration_path = "#{bundle_app_path}/db/migrate"
                  
          entity = Entity.find_by_name(class_name)
          @attributes = entity.entity_columns
          @all_attrs = @attributes.map { |attr| ':' + attr.name }.join(',')
          @pkColumn = @attributes.find { |attr| attr.pk == true }
          @pkColumnName = @pkColumn ? @pkColumn.name : 'id'
                  
          template "model.rb", "#{model_path}/#{singular_name}.rb"
          template "migration.rb", "#{migration_path}/#{Hatio::Generators::MigrationUtil.next_migration_number}_create_#{table_name}.rb"
              
          puts "\nSuccess"
        rescue StandardError => e
          puts "\nError : #{e}"
        end
      end
  
      private 
  
      def next_migration_number
        Time.now.utc.strftime("%Y%m%d%H%M%S")
      end
  
    end

  end
end