class Chit < ActiveRecord::Base

	include Multitenant

	include Attachable

	include PropertyKeepable

	stampable

	strip_cols [:name]

	validates_presence_of :entity_id, :strict => true

	validates_presence_of :name, :strict => true

	validates :name, length: { maximum: 64 }, :strict => true

	validates :description, length: { maximum: 255 }, :strict => true

	validates_uniqueness_of :name, :strict => true, :scope => [:domain_id,:entity_id]

	belongs_to :entity

end
