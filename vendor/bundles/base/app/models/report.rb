class Report < ActiveRecord::Base
  
  include Multitenant
  
  stampable
  strip_cols [:name]
  
  validates_presence_of :name, :strict => true
  validates :name, length: { maximum: 60 }, :strict => true
  validates :description, length: { maximum: 255 }, :strict => true
  validates_uniqueness_of :name, :strict => true, :scope => :domain_id  
  
  has_many :report_params
  mount_uploader :template, FileUploader

end
