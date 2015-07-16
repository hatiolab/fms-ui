class ServiceOutParam < ActiveRecord::Base
  
  strip_cols [:name]
  
  belongs_to :resource, :polymorphic => true

  validates_presence_of :name, :strict => true
  validates :name, length: { maximum: 60 }, :strict => true
  validates :description, length: { maximum: 255 }, :strict => true
  validates_uniqueness_of :name, :strict => true, :scope => [:resource_type, :resource_id]
    
end
