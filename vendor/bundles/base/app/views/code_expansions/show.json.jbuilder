json.(@code_expansion, :id,:domain_id,:expansion_code_id,:data_1,:data_2,:data_3,:data_4,:data_5,:data_6,:data_7,:data_8,:data_9,:data_10,:created_at,:updated_at)

json.creator @code_expansion.creator, :id, :name if @code_expansion.creator
json.updater @code_expansion.updater, :id, :name if @code_expansion.updater