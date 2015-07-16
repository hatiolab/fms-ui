json.(@chit, :id,:domain_id,:entity_id,:name,:description,:template,:logic,:creator_id,:updater_id,:created_at,:updated_at)

json.entity do
	json.id @chit.entity_id
	json.name @chit.entity ? @chit.entity.name : ''
	json.description @chit.entity ? @chit.entity.description : ''
end
