class InfographicsController < ResourceMultiUpdateController

  def show_by_entity

    entity_name = params[:entity_type].classify
    entity, clazz = Entity.find_by_name(entity_name), eval(entity_name)

    if empty_param?(params, :entity_id)
      @infographic, @on = entity.list_infographic, clazz
    else
      @infographic, @on = entity.item_infographic, clazz.find(params[:entity_id])
    end

    if @infographic.nil?
      # raise Exception.new('Infographic is not configured for requested entity yet.')
      respond_to do |format|
        format.xml  { render :xml => {:success => false, :msg => 'Infographic is not configured for requested entity yet.'} }
        format.json { render :json => {:success => false, :msg => 'Infographic is not configured for requested entity yet.'} }
      end
    else
      render :show_diagram
    end
  end

  private
    def resource_params
      [ params.require(:infographic).permit(:name, :description, :infographic_type, :printer_type, :diagram, :print_command) ]
    end
end
