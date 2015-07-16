class ReportsController < ResourceMultiUpdateController
  
  def update
    request.format = 'json'
    super
  end
  
  private
    def multi_update_attrs_to_rem
      ['template_url']
    end
  
    def multi_create_attrs_to_rem
      ['template_url']
    end
    
    def resource_params
      # [ params.require(:report).permit(:name, :description) ]
      [ params.permit(:name, :description, :template) ]
    end
end
