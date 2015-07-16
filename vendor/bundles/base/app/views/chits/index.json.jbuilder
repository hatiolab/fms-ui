json.items do |json|
	json.array!(@collection) do |chit|
json.(chit, :id,:domain_id,:entity_id,:name,:description,:template,:logic,:creator_id,:updater_id,:created_at,:updated_at)

		json.entity do
			json.id chit.entity_id
			json.name chit.entity ? chit.entity.name : ''
		end

		json.updater do
			json.id chit.updater_id
			json.name chit.updater ? chit.updater.name : ''
		end
	end
end
json.total @total_count
json.success true
