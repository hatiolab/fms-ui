require 'open3'

class EntitiesController < ResourceMultiUpdateController
  
    #
    # get entities/:id/entity_columns.json
    #
    def entity_columns
      @entity = Entity.find(params[:id])
      @entity_columns = @entity.entity_columns
    end
    
    #
    # get entities/:id/entity_props.json
    #
    def entity_props
      @entity = Entity.find(params[:id])
      @entity_props = @entity.entity_properties
    end
    
    #
    # get entities/:id/entity_logics.json
    #
    def entity_logics
      @entity = Entity.find(params[:id])
      @entity_logics = @entity.entity_logics
    end
    
    #
    # post entities/:id/create_entity_columns.json
    #
    def create_entity_columns
      @entity = Entity.find(params[:id])
      @entity_columns = @entity.create_entity_columns
      
      respond_with(resource) do |format|
        format.xml  { render 'entity_columns' }
        format.json { render 'entity_columns' }
      end
    end
    
    #
    # post entities/:id/update_multiple_entity_columns.json
    #
    def update_multiple_entity_columns
      update_multiple_details(EntityColumn, params[:multiple_data])
      @entity = Entity.find(params[:id])
      @entity_columns = @entity.entity_columns
      
      respond_with(resource) do |format|
        format.xml  { render 'entity_columns' }
        format.json { render 'entity_columns' }
      end
    end
    
    #
    # post entities/:id/update_multiple_entity_props.json
    #
    def update_multiple_entity_props
      update_multiple_details(EntityProperty, params[:multiple_data])
      @entity = Entity.find(params[:id])
      @entity_props = @entity.entity_properties
      
      respond_with(resource) do |format|
        format.xml  { render 'entity_props' }
        format.json { render 'entity_props' }
      end
    end
    
    #
    # post entities/:id/update_multiple_entity_logics.json
    #
    def update_multiple_entity_logics
      update_multiple_details(EntityLogic, params[:multiple_data])
      @entity = Entity.find(params[:id])
      @entity_logics = @entity.entity_logics
      
      respond_with(resource) do |format|
        format.xml  { render 'entity_logics' }
        format.json { render 'entity_logics' }
      end
    end
    
    #
    # post entities/:id/generate.json
    # {"api_gen_type"=>"all", "api_id_type"=>"auto-increment", "api_runtime_opt"=>"--force", "api_del_hist"=>"true", "api_create_table"=>"true", "view_skip"=>"false", "view_type"=>"list", "view_detail_type"=>"view", "view_skip_store"=>"true", "view_runtime_opt"=>"--force", "name" => "Supplier", "bundle"=>"master", "use_attachment" => true, "use_ext_prop" => true}
    #
    def generate
      raise "Empty bundle not allowed!" if (params[:bundle].empty?)
      columns, command_str_arr, success, output_str = params.delete(:columns), [], true, ""
      use_attachment = ((params[:use_attachment] || 'false') == 'true') ? 'y' : 'n'
      use_ext_prop = ((params[:use_ext_prop] || 'false') == 'true') ? 'y' : 'n'
      columns.gsub!('"', '~')
      columns.gsub!(',', '^')
      
      # generate api
      if(!params[:api_gen_type].blank? && :none.to_s != params[:api_gen_type])
        bundle = params[:bundle]
        id_type = params[:api_id_type] || 'auto-increment'
        api_gen_type = params[:api_gen_type]
        api_runtime_opt = params[:api_runtime_opt] || ''
        del_trace = ((params[:api_del_trace] || 'false') == 'true') ? 'y' : 'n'
        command_str_arr << "rails generate hatio:resource_api #{params[:name]} #{api_runtime_opt} --domain=#{Domain.current_domain.name} --id_type=#{id_type} --gen_type=#{api_gen_type} --bundle=#{bundle} --del_trace=#{del_trace} --use_attachment=#{use_attachment} --use_ext_prop=#{use_ext_prop} --columns=#{columns}"
      end
      
      # generate views
      if(params[:view_skip].blank? || :true.to_s != params[:view_skip])
        view_type = params[:view_type] || 'list'
        detail_view_type = params[:view_detail_type] || 'none'
        view_type = 'list-item' if(detail_view_type != 'none' && view_type == 'list')
        view_runtime_opt = params[:view_runtime_opt] || ''
        view_skip_store = ((params[:view_skip_store] || 'false') == 'true') ? 'y' : 'n'
        view_parent_menu = params[:view_parent_menu] || 'none'
        view_parent_menu = 'none' if(view_parent_menu.empty?)
        command_str_arr << "rails generate hatio:resource_view #{params[:name]} #{view_runtime_opt} --domain=#{Domain.current_domain.name} --bundle=#{params[:bundle]} --view_type=#{view_type} --detail_view_type=#{detail_view_type} --skip_store=#{view_skip_store}  --use_attachment=#{use_attachment} --use_ext_prop=#{use_ext_prop} --parent_menu=#{view_parent_menu} --columns=#{columns}"
      end

      if(success && command_str_arr.length > 0)
        command_str_arr.each do |command_str| 
          if(success) 
            success, output = run_command(command_str) 
            output_str << output
          end
        end
      end
      
      # create table
      if(!params[:create_table].blank? && :false.to_s != params[:create_table])
        success, output = generate_table
        output_str << output
      end
      
      respond_to do |format|
        format.xml { render :xml => { :success => success, :msg => output_str } }
        format.json { render :json => { :success => success, :msg => output_str } }
      end
    end
    
  private
    #
    # generate table
    #
    def generate_table
      success, output, std_str, err_str = true, "", "", ""

      begin
        # rake railties:install:migrations
        Open3.popen3('rake', 'railties:install:migrations') do |stdin, stdout, stderr, wait_thr|
          stdout.each { |line| std_str << line }
          stderr.each { |line| err_str << line }
        end
        
        # rake db:migrate
        Open3.popen3('rake', 'db:migrate') do |stdin, stdout, stderr, wait_thr|
          stdout.each { |line| std_str << line }
          stderr.each { |line| err_str << line }
        end
        
        if(std_str && !std_str.empty?)
          result_arr = std_str.split("\n")
          result_str = result_arr.pop
          success = result_str.match(/migrated/) ? true : false
          output = success ? std_str : ((!err_str || err_str.empty?) ? std_str : err_str)
        else
          success = false
          output = (!err_str || err_str.empty?) ? 'There is no migration file to migrate!' : err_str
        end
        
      rescue ::Exception => e
        success, output = false, e.to_s
      end
      
      return success, output
    end
      
    def run_command(command_str)
      debug_print command_str
      success, output, std_str, err_str = false, "", "", ""
      
      begin
        Open3.popen3(command_str) do |stdin, stdout, stderr, wait_thr|
          stdout.each { |line| std_str << line }
          stderr.each { |line| err_str << line }
        end
        
        puts std_str
        puts err_str
        result_arr = std_str.split("\n")
        result_str = result_arr.pop
        success = (result_str == :Success.to_s) ? true : false
        output = success ? std_str : ((!err_str || err_str.empty?) ? std_str : err_str)
        
      rescue ::Exception => e
        success, output = false, e.to_s
      end
      
      return success, output
    end
    
    def update_multiple_details(rsc_cls, multiple_data)
      delete_list, update_list, create_list = refine_multiple_data(multiple_data, 'id')
      
      rsc_cls.transaction do
        # 1. delete
        self.destroy_multiple_data(rsc_cls, delete_list)
        # 2. update
        self.update_multiple_data(rsc_cls, update_list, 'id', ['entity_id'], {})
        # 3. create
        self.create_multiple_data(rsc_cls, create_list, false, 'id', [], {})
      end
    end

    def resource_params
      [ params.require(:entity).permit(:id, :name, :description, :bundle, :list_infographic_id, :item_infographic_id) ]
    end
end