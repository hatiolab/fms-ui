class Geofence < ActiveRecord::Base

	include Multitenant

	stampable

	strip_cols [:name]

	validates_presence_of :name, :strict => true

	validates :name, length: { maximum: 64 }, :strict => true

	validates :description, length: { maximum: 255 }, :strict => true

	validates_uniqueness_of :name, :strict => true, :scope => [:domain_id]
  
  has_and_belongs_to_many :fleet_groups, :join_table => "geofence_groups"
  
  has_many :polygons
  
end
