json.items do |json|
	json.array!(@collection) do |event|
		json.(event, :id,:dom,:fid,:fvr,:did,:tid,:bid,:gid,:etm,:ctm,:kct,:typ,:vlc,:svr,:lat,:lng,:gx,:gy,:gz,:vdo,:f_vdo,:r_vdo,:ado)

		json.driver event.driver, :id, :code, :name if event.driver
		json.geofence event.geofence, :id, :name, :description if event.geofence
	end
end
json.total @total_count

json.type_summary do
	json.geofence @type_summary[:geofence]
	json.impact @type_summary[:impact]
	json.overspeed @type_summary[:overspeed] 
	json.emergency @type_summary[:emergency]
end if @type_summary

json.success true
