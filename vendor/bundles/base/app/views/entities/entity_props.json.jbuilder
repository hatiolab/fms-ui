json.items do |json|
	json.array!(@entity_props) do |entity_prop|
  	json.(entity_prop, :id,:entity_id,:name,:description,:attribute_type,:ref_type, :ref_name,:editable,:disp_rank)
	end
end

json.success true
json.total @entity_props.length