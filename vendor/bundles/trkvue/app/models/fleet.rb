class Fleet < ActiveRecord::Base

  include Multitenant
  
	stampable

	strip_cols [:name]

	validates_presence_of :name, :strict => true
  
	validates_uniqueness_of :name, :strict => true, :scope => [:domain_id]
  
  belongs_to :fleet_group

  belongs_to :driver

  mount_uploader :car_image, ImageUploader

  before_create do 
  	if(!self.lat || self.lat == 0 || !self.lng || self.lng == 0)
  		domain = Domain.current_domain
  		self.lat = domain.lat
  		self.lng = domain.lng
  	end
  end

end
