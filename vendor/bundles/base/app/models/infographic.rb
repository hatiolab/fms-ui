class Infographic < ActiveRecord::Base
  
  include Multitenant
  include PropertyKeepable

	stampable
  strip_cols [:name]
  
  validates_presence_of :name, :strict => true
  validates_presence_of :infographic_type, :strict => true
  validates :name, length: { maximum: 60 }, :strict => true
  validates :description, length: { maximum: 255 }, :strict => true
  validates_uniqueness_of :name, :strict => true, :scope => :domain_id  
  
end
