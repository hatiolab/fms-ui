class Fleet < ActiveRecord::Base

  include Multitenant
  
	stampable

	strip_cols [:name]

	validates_presence_of :name, :strict => true
  
	validates_uniqueness_of :name, :strict => true, :scope => [:domain_id]
  
  belongs_to :fleet_group

  belongs_to :driver

  mount_uploader :car_image, ImageUploader

end
