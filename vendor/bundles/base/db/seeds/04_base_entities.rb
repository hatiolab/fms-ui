#encoding: utf-8 

Entity.setup Domain, {:bundle =>'base'} do
  @list_columns = ['name', 'description', 'system_flag']
end

Entity.setup Calendar, {:bundle =>'base'} do
  @list_columns = ['name', 'description']
end

Entity.setup User, {:bundle =>'base'} do
  @list_columns = ['login', 'name', 'email', 'default_domain_id', 'admin_flag', 'lang', 'timezone']
end

Entity.setup Role, {:bundle =>'base'} do
  @list_columns = ['name', 'description', 'updater_id', 'updated_at']
end

Entity.setup CommonCode, {:bundle => 'base'} do 
  @list_columns = ['name', 'description', 'updater_id', 'updated_at']
  column :parent_id, :resource => 'CommonCode'
end

Entity.setup ExpansionCode, {:bundle => 'base'} do 
  @list_columns = ['name', 'description', 'updater_id', 'updated_at']
end

Entity.setup CodeExpansion, {:bundle => 'base'} do 
  @list_columns = ['expansion_code_id', 'data_1', 'data_2', 'data_3', 'data_4', 'data_5', 'data_6', 'data_7', 'data_8', 'data_9', 'data_10', 'updater_id', 'updated_at']
  column :expansion_code_id, :resource => 'ExpansionCode'
end

Entity.setup Entity, {:bundle => 'base'} do
  @list_columns = ['name', 'description', 'bundle', 'updater_id', 'updated_at']
end

Entity.setup Menu, {:bundle => 'base'} do 
  @list_columns = ['name', 'description', 'rank', 'updater_id', 'updated_at']
  column :parent_id, :resource => 'Menu'
end

Entity.setup ErrorLog, {:bundle => 'base'} do
  @list_columns = ['issue_date', 'status', 'error_type', 'uri', 'message', 'created_at']
end

Entity.setup DiyService, {:bundle => 'base'} do
  @list_columns = ['name', 'description', 'script_type', 'active_flag', 'atomic_flag', 'updater_id', 'updated_at']
  column :script_type, :code => 'SCRIPT_TYPE'
end

Entity.setup DiySelection, {:bundle => 'base'} do
  @list_columns = ['name', 'description', 'script_type', 'updater_id', 'updated_at']
  column :script_type, :code => 'SCRIPT_TYPE'
end

Entity.setup DiyReport, {:bundle => 'base'} do
  @list_columns = ['name', 'description', 'diy_selection_id', 'updater_id', 'updated_at']
  column :diy_selection_id, :resource => 'DiySelection'
end

Entity.setup Attachment, {:bundle => 'base'} do
  @list_columns = ['name', 'description', 'on_type', 'on_id', 'tag', 'path', 'updater_id', 'updated_at']
  column :on_type, :resource => 'POLYMORPHIC'
end

Entity.setup Property, {:bundle => 'base'} do
  @list_columns = ['name', 'value', 'description', 'on_type', 'on_id', 'value', 'updater_id', 'updated_at']
  column :on_type, :resource => 'POLYMORPHIC'
end

Entity.setup Terminology, {:bundle => 'base'} do
  @list_columns = ['category', 'name', 'locale', 'display', 'display_short', 'updater_id', 'updated_at']
  column :category, :code => 'LOCALE'
  column :locale, :code => 'TERMS_CATEGORY'
end

Entity.setup Variable, {:bundle => 'base'} do
  @list_columns = ['name', 'description', 'category', 'updater_id', 'updated_at']
  column :category, :code => 'VARIABLE_CATEGORY'
end

Entity.setup Infographic, {:bundle => 'base'} do
  @list_columns = ['name', 'description', 'infographic_type', 'printer_type', 'updater_id', 'updated_at']
  column :infographic_type, :code => 'INFOGRAPHIC_TYPE'
  column :printer_type, :code => 'PRINTER_TYPE'
end

Entity.setup Contact, {:bundle => 'base'} do
  @list_columns = ['name', 'family_name', 'given_name', 'company', 'department', 'title', 'phone_office', 'phone_mobile', 'email']
end

Entity.setup Report, {:bundle => 'base'} do
  @list_columns = ['name', 'template', 'updater_id', 'updated_at']
end

Entity.setup RemTrace, {:bundle => 'base'} do
  @list_columns = ['name', 'entity_type', 'entity_id', 'content', 'creator_id', 'created_at']
end

Entity.setup RemTrace, {:bundle => 'base'} do
  @list_columns = ['entity_type', 'entity_id', 'name', 'content', 'updater_id', 'updated_at']
  column :entity_type, :resource => 'POLYMORPHIC'
end

Entity.setup Chit, {:bundle => 'base'} do
  @list_columns = ['entity_id', 'name', 'description', 'updater_id', 'updated_at']
  column :entity_id, :resource => 'POLYMORPHIC'
end