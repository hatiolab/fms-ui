#encoding: utf-8 

group1 = FleetGroup.create! :name => "Group-A", :description => "그룹 A"
group2 = FleetGroup.create! :name => "Group-B", :description => "그룹 B"
group3 = FleetGroup.create! :name => "Group-C", :description => "그룹 C"

gf1 = Geofence.create! :name => "Area-A", :description => "지역 A"
gf2 = Geofence.create! :name => "Area-B", :description => "지역 B"
gf3 = Geofence.create! :name => "Area-C", :description => "지역 C"

Fleet.create!(name: 'F1000001', device_name: '아리온 DVR', device_model: 'A1', driver_id: 'HongKilDong', car_no: '29커8119', car_model: 'Carnival', car_image: '', purchase_date: '2015-05-01', reg_date: '2015-05-15', lat: 121.74, lng: 31.21, status: 'RUN', velocity: 0, fleet_group_id: group1.id)
Fleet.create!(name: 'F1000002', device_name: '아리온 DVR', device_model: 'A2', driver_id: 'Tom', car_no: 'ESJ9110', car_model: 'Benz', car_image: '', purchase_date: '2015-05-01', reg_date: '2015-05-15', lat: 121.57, lng: 36.83, status: 'IDLE', velocity: 0, fleet_group_id: group1.id)
Fleet.create!(name: 'F1000003', device_name: '아리온 DVR', device_model: 'A3', driver_id: 'Hatio', car_no: '11너2431', car_model: 'K9', car_image: '', purchase_date: '2015-04-01', reg_date: '2015-06-01', lat: 122.43, lng: 35.72, status: 'IDLE', velocity: 0, fleet_group_id: group2.id)
Fleet.create!(name: 'F1000004', device_name: '아리온 DVR', device_model: 'A3', driver_id: 'Christina', car_no: 'HFL2909', car_model: 'SCANIA', car_image: '', purchase_date: '2015-04-11', reg_date: '2015-05-01', lat: 123.74, lng: 33.45, status: 'IDLE', velocity: 0, fleet_group_id: group2.id)
Fleet.create!(name: 'F1000005', device_name: '아리온 DVR', device_model: 'A5', driver_id: 'Julia', car_no: 'SUU1729', car_model: 'IVECO', car_image: '', purchase_date: '2015-05-01', reg_date: '2015-05-01', lat: 124.87, lng: 32.78, status: 'IDLE', velocity: 0, fleet_group_id: group3.id)
Fleet.create!(name: 'F1000006', device_name: '아리온 DVR', device_model: 'A1', driver_id: 'Rodriguez', car_no: 'ESJ9115', car_model: 'Volvo', car_image: '', purchase_date: '2015-06-01', reg_date: '2015-06-01', lat: 125.91, lng: 33.98, status: 'IDLE', velocity: 0, fleet_group_id: group3.id)

GeofenceGroup.create!(geofence_id: gf1.id, fleet_group_id: group1.id)
GeofenceGroup.create!(geofence_id: gf2.id, fleet_group_id: group2.id)
GeofenceGroup.create!(geofence_id: gf3.id, fleet_group_id: group3.id)