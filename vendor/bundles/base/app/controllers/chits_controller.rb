class ChitsController < ResourceMultiUpdateController
  
public
  def print
    chit = Chit.find(params[:id])
    resource = params[:on_type].constantize.find(params[:on_id])
    xlsx_package = resource.instance_eval chit.logic
      
    respond_to do |format|
      format.xlsx {
        render_inline_xlsx(params[:on_type], xlsx_package)
      }
    end
  end
  
private
  def resource_params
    [ params.require(:chit).permit(:entity_id,:name,:description,:template,:logic) ]
  end
end
