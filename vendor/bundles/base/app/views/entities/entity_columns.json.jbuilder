json.parent do |json|
	json.(@entity, :id, :name, :description, :bundle)
end

json.items do |json|
	json.array!(@entity_columns) do |entity_column|
  	json.(entity_column, :id,:entity_id, :name,:description,:term,:col_type,:col_size,:nullable,:uniq_rank,:def_val,:ref_type,:ref_name,:list_rank,:disp_rank)
	end
end

json.success true
json.total @entity_columns.length