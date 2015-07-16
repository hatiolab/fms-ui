class Polygon < ActiveRecord::Base

	validates_presence_of :geofence_id,:lat,:lng, :strict => true

	validates :geofence_id, length: { maximum: 32 }, :strict => true

	belongs_to :geofence

end
