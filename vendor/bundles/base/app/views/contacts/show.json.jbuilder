json.(@contact, :id, :name, :description, :family_name, :given_name, :company, :department, :title, :email, :phone_office, :phone_mobile, :fax, :address)

json.updated_at @contact.updated_at
json.updater @contact.updater, :id, :name if @contact.updater

json.created_at @contact.created_at
json.creator @contact.creator, :id, :name if @contact.creator

json.properties_attributes @contact.properties_attributes
