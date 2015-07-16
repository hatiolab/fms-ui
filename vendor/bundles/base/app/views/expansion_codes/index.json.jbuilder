json.items do |json|
	json.array!(@collection) do |expansion_code|
		json.(expansion_code, :id,:domain_id,:name,:description,:creator_id,:updater_id,:created_at,:updated_at)
		json.updater expansion_code.updater, :id, :name if expansion_code.updater
	end
end
json.total @total_count
json.success true
