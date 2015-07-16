class EntityProperty < ActiveRecord::Base
  
  belongs_to :entity
  strip_cols [:name]

  default_scope { order("disp_rank ASC") }
  
  validates_presence_of :name, :strict => true
  validates :name, length: { maximum: 64 }, :strict => true
  validates :description, length: { maximum: 255 }, :strict => true
  validates_uniqueness_of :name, :strict => true, :scope => [:entity_id]
  validates_presence_of :attribute_type, :strict => true
  
end
