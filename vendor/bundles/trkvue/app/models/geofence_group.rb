class GeofenceGroup < ActiveRecord::Base

  include Multitenant
  
	stampable

	validates_presence_of :fleet_group_id,:geofence_id,:alarm_type, :strict => true
  
	validates_uniqueness_of :fleet_group_id, :alarm_type, :strict => true, :scope => [:geofence_id]
  
	validates_uniqueness_of :geofence_id, :alarm_type, :strict => true, :scope => [:fleet_group_id]

	belongs_to :fleet_group

	belongs_to :geofence

end
