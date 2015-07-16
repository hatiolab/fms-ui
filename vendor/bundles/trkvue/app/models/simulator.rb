class Simulator < ActiveRecord::Base

	include Multitenant

	# TODO type 필드를 simulator type으로 변경 필요 
	self.inheritance_column = :_type_disabled

	stampable

	strip_cols [:name]

	validates_presence_of :name,:type,:url, :strict => true

	validates :name, length: { maximum: 32 }, :strict => true

	validates :description, length: { maximum: 255 }, :strict => true

	validates :type, length: { maximum: 20 }, :strict => true

	validates :fleet_group_id, length: { maximum: 32 }, :strict => true

	validates :fleet_id, length: { maximum: 32 }, :strict => true

	validates :fleet_ver, length: { maximum: 20 }, :strict => true

	validates :url, length: { maximum: 255 }, :strict => true

	validates :simulator_path_id, length: { maximum: 32 }, :strict => true

	validates :event_type, length: { maximum: 10 }, :strict => true

	validates :severity, length: { maximum: 10 }, :strict => true

	validates :stillcut_paths, length: { maximum: 500 }, :strict => true

	validates :movie_paths, length: { maximum: 1000 }, :strict => true

	validates_uniqueness_of :name, :strict => true, :scope => [:domain_id]

	belongs_to :fleet
  belongs_to :fleet_group
	belongs_to :simulator_path

end
