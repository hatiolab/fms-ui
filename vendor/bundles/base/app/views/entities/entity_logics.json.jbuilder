json.items do |json|
	json.array!(@entity_logics) do |entity_logic|
  	json.(entity_logic, :id,:entity_id,:name,:description,:level,:logic)
	end
end

json.success true
json.total @entity_logics.length