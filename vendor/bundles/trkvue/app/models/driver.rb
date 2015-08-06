require 'carrierwave/orm/activerecord'

class Driver < ActiveRecord::Base

	include Multitenant

	include Attachable

	stampable

	strip_cols [:code]

	validates_presence_of :code,:name, :strict => true

	validates :code, length: { maximum: 32 }, :strict => true

	validates :name, length: { maximum: 64 }, :strict => true

	validates :social_id, length: { maximum: 32 }, :strict => true

	validates :email, length: { maximum: 64 }, :strict => true

	validates :title, length: { maximum: 32 }, :strict => true

	validates :division, length: { maximum: 32 }, :strict => true

	validates :phone_no, length: { maximum: 32 }, :strict => true

	validates :mobile_no, length: { maximum: 32 }, :strict => true

	validates :address, length: { maximum: 255 }, :strict => true

	#validates :img, length: { maximum: 255 }, :strict => true

	validates_uniqueness_of :name, :strict => true, :scope => [:domain_id,:code]

	mount_uploader :img, ImageUploader
	
end
