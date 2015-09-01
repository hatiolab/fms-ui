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
  code 'MOVIE' => 'Movie Upload'
end

CommonCode.setup :DATE_FORMAT, {:description => 'Date Format'} do
  code 'M/d/yy' => 'M/d/yy (8/9/15)'
  code 'MMM d, y' => 'MMM d, y (Aug 9, 2015)'
  code 'MMM/dd/yy' => 'MMM/DD/YY (Aug/09/15)'
  code 'MMM/dd/yyyy' => 'DD/MM/YYYY (09/08/2015)'
  code 'dd/MM/yy' => 'DD/MM/YY (09/08/15)'
  code 'dd/MM/yyyy' => 'DD/MM/YYYY (09/08/2015)'
  code 'yy-MM-dd' => 'DD/MM/YY (09/08/15)'
  code 'yyyy-MM-dd' => 'YYYY-MM-DD (2015-08-09)'
end

CommonCode.setup :TIME_FORMAT, {:description => 'Time Format'} do
  code 'HH:mm' => 'HH:mm (15:45)'
  code 'HH:mm:ss' => 'HH:mm:ss (15:45:56)'
  code 'hh:mm a' => 'hh:mm a (03:55 AM/PM)'
  code 'hh:mm:ss a' => 'hh:mm:ss a (03:55:56 AM/PM)'
end