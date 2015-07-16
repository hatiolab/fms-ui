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
  @list_columns = ['name', 'device_name','device_model','driver_id','car_no','car_model','car_image','fleet_group_id','purchase_date','reg_date','lat','lng','status','trip_id','batch_id','trip_id','last_trip_time']
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

# Entity.setup Trip, {:bundle =>'trkvue'} do
#   @list_columns = ['cid','fid','fvr','did','s_lat','s_lng','lat','lng','e_lat','e_lng','kct','l_kct','stm','utm','etm','sts','c_idl','c_low','c_nml','c_hgh','c_ovr']
#   @search_columns = ['cid','fid','fvr','did']
#   @sort_columns = []
#   @editable_columns = ['cid','fid','fvr','did','s_lat','s_lng','lat','lng','e_lat','e_lng','kct','l_kct','stm','utm','etm','sts','c_idl','c_low','c_nml','c_hgh','c_ovr']
# end
#
# Entity.setup Track, {:bundle =>'trkvue'} do
#   @list_columns = ['cid','fid','fvr','tid','did','stm','ttm','ctm','kct','vlc','a_vlc','dst','lat','lng','p_lat','p_lng','gx','gy','gz','f_img','r_img']
#   @search_columns = ['cid','fid','fvr','did']
#   @sort_columns = []
#   @editable_columns = ['cid','fid','fvr','tid','did','stm','ttm','ctm','kct','vlc','a_vlc','dst','lat','lng','p_lat','p_lng','gx','gy','gz','f_img','r_img']
# end
#
# Entity.setup Event, {:bundle =>'trkvue'} do
#   @list_columns = ['cid','fid','fvr','did','tid','stm','etm','ctm','kct','typ','vlc','svr','lat','lng','gx','gy','gz','vdo','f_vdo','r_vdo','ado']
#   @search_columns = ['cid','fid','fvr','did']
#   @sort_columns = []
#   @editable_columns = ['cid','fid','fvr','did','tid','stm','etm','ctm','kct','typ','vlc','svr','lat','lng','gx','gy','gz','vdo','f_vdo','r_vdo','ado']
# end
