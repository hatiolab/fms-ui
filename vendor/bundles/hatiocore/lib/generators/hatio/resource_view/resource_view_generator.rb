require 'generators/hatio/util/migration_util'
require 'generators/hatio/util/model_util'
require 'generators/hatio/util/resource_view_util'
require 'generators/hatio/util/report_view_util'

module Hatio
  module Generators
    class ResourceViewGenerator < Rails::Generators::NamedBase
  
      source_root File.expand_path('../templates', __FILE__)
      argument :model_attributes, :type => :string, :default => [], :banner => "model:attributes"
      class_option :domain, :type => :string, :default => '', :desc => "Domain"
      class_option :bundle, :type => :string, :default => '', :desc => "Bundle name"
      class_option :view_type, :type => :string, :default => 'list-detail', :desc => 'Client Screen Type'
      class_option :skip_store, :type => :string, :default => 'n', :desc => 'Skip model and store generation'
      class_option :detail_view_type, :type => :string, :default => 'none', :desc => 'Detail view type none|view|popup'
      class_option :use_attachment, :type => :string, :default => 'n', :desc => 'Use attachment or not'
      class_option :use_ext_prop, :type => :string, :default => 'n', :desc => 'Use extension properties or not'
      class_option :parent_menu, :type => :string, :default => '', :desc => 'Parent menu name'
      class_option :diy_selection_id, :type => :string, :default => '', :desc => 'Report service reference'
      class_option :columns, :type => :string, :desc => 'Column informations'
  
      def generate_views
        begin
          raise "Domain name is empty!" if(options.domain.empty?)
          raise "Bundle name is empty!" if(options.bundle.empty?)
          
          @bundle = options.bundle.camelcase
          js_base_path = "vendor/bundles/#{@bundle.downcase}/app/assets/javascripts/bundle/#{@bundle.downcase}"
          js_base_dir = File.join(Rails.root, js_base_path)
          raise "Bundle #{@bundle} is not exist!" unless File.exist?(js_base_dir)

          controller_path = "#{js_base_path}/controller/#{singular_name}"
          model_path = "#{js_base_path}/model"
          store_path = "#{js_base_path}/store"
          view_path = "#{js_base_path}/view/#{singular_name}"

          controller_dir = File.join(Rails.root, controller_path)
          FileUtils.mkdir "#{controller_dir}" unless File.exist?("#{controller_dir}")

          view_dir = File.join(Rails.root, view_path)
          FileUtils.mkdir "#{view_dir}" unless File.exist?("#{view_dir}")

          @domain = Domain.find_by_name(options.domain)
          Domain.current_domain = @domain

          if(options.view_type == 'report')
            raise "Bundle name is empty!" if(options.diy_selection_id.empty?)
            @diy_selection = DiySelection.find(options.diy_selection_id)
            raise "Not found DiySelection By [#{options.diy_selection_id}]" unless @diy_selection
            @service_url = "'diy_selections/#{@diy_selection.name}/query.json'"
            @in_params = @diy_selection.service_in_params
            @out_params = @diy_selection.service_out_params
          else
            entity = Entity.find_by_name(class_name)
            @columns = entity.entity_columns
            cols_str = options.columns
            cols_str.gsub!('~', '"')
            cols_str.gsub!('^', ',')
            col_infos = JSON.parse(cols_str)
            
            @columns.each do |column|
              col = col_infos.find { |col| col["id"].to_i == column.id }
              if(col)
                column.max = col["max"] if(col.key?("max") && column.col_type == 'integer' || column.col_type == 'float' || column.col_type == 'decimal')
                column.min = col["min"] if(col.key?("min") && column.col_type == 'integer' || column.col_type == 'float' || column.col_type == 'decimal')
                column.editable = col["editable"] if(col.key?("editable"))
                column.trimable = col["trimable"] if(col.key?("trimable"))
                column.search_rank = col["search_rank"] if(col.key?("search_rank"))
                column.sort_rank = col["sort_rank"] if(col.key?("sort_rank"))
                column.reverse_sort = col["reverse_sort"] if(col.key?("reverse_sort"))
              end
            end
          end

          if((options.view_type != 'report') && (!options.skip_store || options.skip_store == 'n'))
            template "Store.js", "#{store_path}/#{class_name}.js"
            template "Model.js", "#{model_path}/#{class_name}.js"
          end
      
          if(options.view_type == 'list-detail')
            template "list/Controller.js", "#{controller_path}/#{class_name}.js"
            template "list/ListMain.js", "#{view_path}/#{class_name}.js"
            template "list/ListGrid.js", "#{view_path}/#{class_name}List.js"
            template "list/ListSearch.js", "#{view_path}/#{class_name}Search.js"
        
            if(options.detail_view_type == 'popup')
              template "detail/PopupController.js", "#{controller_path}/#{class_name}Detail.js"
              template "detail/DetailPopup.js", "#{view_path}/#{class_name}Detail.js"
              template "detail/DetailForm.js", "#{view_path}/#{class_name}Form.js"
            else
              template "detail/ViewController.js", "#{controller_path}/#{class_name}Detail.js"
              template "detail/DetailMain.js", "#{view_path}/#{class_name}Detail.js"
              template "detail/DetailForm.js", "#{view_path}/#{class_name}Form.js"
            end
            
          elsif(options.view_type == 'list-item')
            template "list/Controller.js", "#{controller_path}/#{class_name}.js"
            template "list/ListMain.js", "#{view_path}/#{class_name}.js"
                    
            if(options.detail_view_type == 'popup')
              template "item/PopupController.js", "#{controller_path}/#{class_name}Item.js"
              template "item/ItemPopup.js", "#{view_path}/#{class_name}Item.js"
              template "item/ItemForm.js", "#{view_path}/#{class_name}Form.js"
            else
              template "item/ViewController.js", "#{controller_path}/#{class_name}Item.js"
              template "item/ItemMain.js", "#{view_path}/#{class_name}Item.js"
              template "item/ItemForm.js", "#{view_path}/#{class_name}Form.js"
            end
                        
          elsif(options.view_type == 'list')
            template "list/Controller.js", "#{controller_path}/#{class_name}.js"
            template "list/ListMain.js", "#{view_path}/#{class_name}.js"
            template "list/ListGrid.js", "#{view_path}/#{class_name}List.js"
            template "list/ListSearch.js", "#{view_path}/#{class_name}Search.js"
        
          elsif(options.view_type == 'detail')
            template "detail/Controller.js", "#{controller_path}/#{class_name}Detail.js"
            template "detail/DetailMain.js", "#{view_path}/#{class_name}Detail.js"
            template "detail/DetailForm.js", "#{view_path}/#{class_name}Form.js"
        
          elsif(options.view_type == 'report')
            template "report/Controller.js", "#{controller_path}/#{class_name}.js"
            template "report/ReportMain.js", "#{view_path}/#{class_name}.js"
            template "report/ReportList.js", "#{view_path}/#{class_name}List.js"
            template "report/ReportSearch.js", "#{view_path}/#{class_name}Search.js"
          end
      
          if(options.parent_menu && !options.parent_menu.empty? && 'none' != options.parent_menu)
            screenId = "#{@bundle}.view.#{singular_name}.#{class_name}"
            screenId << 'Detail' if(options.view_type == 'detail')
            menu = Menu.find_by_template(screenId)
            entityId = entity ? entity.id : ''
        
            unless menu
              parentMenu = Menu.find_by_name(options.parent_menu)
              Menu.create :name => class_name, :description => class_name, :parent_id => parentMenu.id, :category => 'STANDARD', :template => screenId, :menu_type => 'SCREEN', :rank => 1000
              puts "#{class_name} menu created at #{options.parent_menu} Menu!"
            else
              puts "#{class_name} menu already exist!"
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