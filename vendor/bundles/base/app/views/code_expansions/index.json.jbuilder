json.items do |json|
	json.array!(@collection) do |code_expansion|
		json.(code_expansion, :id,:domain_id,:expansion_code_id,:data_1,:data_2,:data_3,:data_4,:data_5,:data_6,:data_7,:data_8,:data_9,:data_10,:creator_id,:updater_id,:created_at,:updated_at)

		json.expansion_code do
			json.id code_expansion.expansion_code_id
			json.name code_expansion.expansion_code ? code_expansion.expansion_code.name : ''
		end
	end
end
json.total @total_count
json.success true
