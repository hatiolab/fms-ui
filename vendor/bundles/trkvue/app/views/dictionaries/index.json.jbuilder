json.items do |json|
	json.array!(@collection) do |dictionary|
json.(dictionary, :id,:domain_id,:name,:description,:locale,:category,:display,:creator_id,:updater_id,:created_at,:updated_at)
	end
end
json.total @total_count
json.success true
