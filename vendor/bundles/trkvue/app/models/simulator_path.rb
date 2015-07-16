class SimulatorPath < ActiveRecord::Base

	include Multitenant

	stampable

	strip_cols [:name]

	validates_presence_of :name, :strict => true

	validates :name, length: { maximum: 32 }, :strict => true

	validates :description, length: { maximum: 255 }, :strict => true

	validates_uniqueness_of :name, :strict => true, :scope => [:domain_id]

end
