json.items do |json|
	json.array!(@permissions) do |permission|
		json.(permission, :id,:name,:resource_type,:action_name,:method_name)
		json.parent_id permission.parent_id if permission.parent_id
	end
end

json.success true
json.total @total_count