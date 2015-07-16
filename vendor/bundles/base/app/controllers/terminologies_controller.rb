class TerminologiesController < ResourceMultiUpdateController

  def locale_resource
    @terminologies = Terminology.to_resource(params['locale'])
    
    respond_to do |format|
      format.json { render json: @terminologies, status: :ok }
    end
  end

private
  def resource_params
    [ params.require(:terminology).permit(:name, :description, :locale, :category, :display, :display_short) ]
  end
end
