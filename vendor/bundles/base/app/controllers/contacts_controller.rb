class ContactsController < ResourceMultiUpdateController
  
private

  def resource_params
    [ params.require(:contact).permit(:name, :description, :family_name, :given_name, :company, :department, :title, :address, :email, :phone_office, :phone_mobile, :fax, properties_attributes: [:id, :value]) ]
  end
end
