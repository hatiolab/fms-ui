#encoding: utf-8 

CommonCode.setup :EVENT_TYPE, {:description => 'Event Type'} do
  code :B => 'Emergency Button'
  code :G => 'G-Sensor'
  code :I => 'Geofence IN'
  code :O => 'Geofence OUT'
  code :V => 'Over Speed'
end

CommonCode.setup :GEOFENCE_ALARM, {:description => 'Geofence Alarm Type'} do
  code :IN => 'IN'
  code :OUT => 'OUT'
end

CommonCode.setup :SIMULATION_TYPE, {:description => 'Simulation type'} do
  code 'EVENT' => 'Event Test'
  code 'ROUTES' => 'Tracking Routes Test'
  code 'STRESS' => 'Stress Test'
  code 'TRACK' => 'Tracking Test'
end