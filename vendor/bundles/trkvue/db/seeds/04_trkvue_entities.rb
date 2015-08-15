#encoding: utf-8 

Entity.setup Setting, {:bundle =>'trkvue'} do
  @list_columns = ['name','description','value','updater_id','updated_at']
  @search_columns = ['name','description']
  @sort_columns = []
  @editable_columns = ['name','description','value']
end

Entity.setup Driver, {:bundle =>'trkvue'} do
  @list_columns = ['code','name','social_id','email','title','division','phone_no','mobile_no','address','img']
  @search_columns = ['code','name','social_id','title','division']
  @sort_columns = []
  @editable_columns = ['code','name','social_id','email','title','division','phone_no','mobile_no','address','img']
end

Entity.setup Fleet, {:bundle =>'trkvue'} do
  @list_columns = ['name','device_name','device_model','driver_id','car_no','car_model','car_image','fleet_group_id','purchase_date','reg_date','lat','lng','status','trip_id','batch_id','trip_id','last_trip_time']
  @search_columns = ['driver_id', 'car_model', 'car_no', 'group_id', 'purchase_date', 'reg_date']
  @sort_columns = []
  @editable_columns = ['name', 'device_name','device_model','driver_id','car_no','car_model','car_image','fleet_group_id','purchase_date','reg_date','lat','lng','status','trip_id','batch_id','trip_id','last_trip_time']
end

Entity.setup FleetGroup, {:bundle =>'trkvue'} do
  @list_columns = ['name','description','updater_id','updated_at']
  @search_columns = ['name','description']
  @sort_columns = []
  @editable_columns = ['name','description','value']
end

Entity.setup Geofence, {:bundle =>'trkvue'} do
  @list_columns = ['name','description','updater_id','updated_at']
  @search_columns = ['name','description']
  @sort_columns = []
  @editable_columns = ['name','description']
end

Entity.setup GeofenceGroup, {:bundle =>'trkvue'} do
  @list_columns = ['fleet_group_id','geofence_if','updater_id','updated_at']
  @search_columns = ['fleet_group_id','geofence_id']
  @sort_columns = []
  @editable_columns = ['fleet_group_id','geofence_id']
end

Entity.setup Polygon, {:bundle =>'trkvue'} do
  @list_columns = ['geofence_id','lat','lng']
  @search_columns = ['geofence_id']
  @sort_columns = []
  @editable_columns = ['geofence_id']
end

Entity.setup Movie, {:bundle =>'trkvue'} do
  @list_columns = ['event_id','total_size','start_byte','chunk_size','chunk_count','chunk_index','file_path','created_at']
  @search_columns = ['event_id']
  @sort_columns = []
  @editable_columns = ['event_id','total_size','start_byte','chunk_size','chunk_count','chunk_index','file_path']
end

Entity.setup Simulator, {:bundle =>'trkvue'} do
  @list_columns = ['name','description','updater_id','updated_at']
  @search_columns = ['fleet_group_id']
  @sort_columns = []
  @editable_columns = ['name','description']
end

Entity.setup SimulatorPath, {:bundle =>'trkvue'} do
  @list_columns = ['name','description','paths','updater_id','updated_at']
  @search_columns = ['fleet_group_id']
  @sort_columns = []
  @editable_columns = ['name','description','paths']
end

Entity.setup FleetGroupSummary, {:bundle =>'trkvue'} do
  @list_columns = ['fleet_group_id','sum_day','velocity','drive_dist','drive_time', 'impact', 'geofence', 'emergency', 'overspeed', 'speed_off', 'speed_idle', 'speed_slow', 'speed_normal', 'speed_high', 'speed_over']
  @search_columns = ['fleet_group_id']
  @sort_columns = []
  @editable_columns = ['fleet_group_id','sum_day','velocity','drive_dist','drive_time', 'impact', 'geofence', 'emergency', 'overspeed', 'speed_off', 'speed_idle', 'speed_slow', 'speed_normal', 'speed_high', 'speed_over']
end

Entity.setup FleetSummary, {:bundle =>'trkvue'} do
  @list_columns = ['fleet_id','sum_day','velocity','drive_dist','drive_time', 'impact', 'geofence', 'emergency', 'overspeed', 'speed_off', 'speed_idle', 'speed_slow', 'speed_normal', 'speed_high', 'speed_over']
  @search_columns = ['fleet_id']
  @sort_columns = []
  @editable_columns = ['fleet_id','sum_day','velocity','drive_dist','drive_time', 'impact', 'geofence', 'emergency', 'overspeed', 'speed_off', 'speed_idle', 'speed_slow', 'speed_normal', 'speed_high', 'speed_over']
end

Entity.setup EventGroupSummary, {:bundle =>'trkvue'} do
  @list_columns = ['fleet_group_id','sum_day','impact', 'geofence', 'emergency', 'overspeed']
  @search_columns = ['fleet_group_id']
  @sort_columns = []
  @editable_columns = ['fleet_group_id','sum_day','impact', 'geofence', 'emergency', 'overspeed']
end

Entity.setup EventSummary, {:bundle =>'trkvue'} do
  @list_columns = ['fleet_id','sum_day','impact', 'geofence', 'emergency', 'overspeed']
  @search_columns = ['fleet_id']
  @sort_columns = []
  @editable_columns = ['fleet_id','sum_day','impact', 'geofence', 'emergency', 'overspeed']
end