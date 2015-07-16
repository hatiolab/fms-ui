json.(@expansion_code, :id,:domain_id,:name,:description,:created_at,:updated_at)

json.creator @expansion_code.creator, :id, :name if @expansion_code.creator
json.updater @expansion_code.updater, :id, :name if @expansion_code.updater

json.items do |json|
	json.array!(@expansion_code.expansion_code_items) do |item|
		json.(item, :id, :name, :description, :bind_index, :nullable, :col_type, :col_size, :ref_type, :ref_name, :unique_flag)
	end
end

# json.data_list do |json|
# 	json.array!(@expansion_code.code_expansions) do |data|
# 		json.(data, :id, :expansion_code, :data_1, :data_2, :data_3, :data_4, :data_5, :data_6, :data_7, :data_8, :data_9, :data_10)
# 	end
# end