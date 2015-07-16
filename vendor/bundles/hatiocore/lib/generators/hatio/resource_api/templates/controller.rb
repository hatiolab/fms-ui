class <%= class_name.pluralize %>Controller < ResourceMultiUpdateController
  
private
  def resource_params
    [ params.require(:<%= singular_name %>).permit(<%= @biz_attrs.collect { |attr| ":#{attr.name}" }.join(",") %>) ]
  end
end
