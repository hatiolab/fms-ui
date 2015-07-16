json.items do |json|
	json.array!(@collection) do |setting|
json.(setting, :id,:domain_id,:global_flag,:name,:description,:value,:creator_id,:updater_id,:created_at,:updated_at)

		json.updater do
			json.id setting.updater_id
			json.name setting.updater ? setting.updater.name : ''
		end
	end
end
json.total @total_count
json.success true
