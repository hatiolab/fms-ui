class EntityColumn < ActiveRecord::Base
  
  belongs_to :entity
  strip_cols [:name]
  
  validates_presence_of :name, :strict => true
  validates :name, length: { maximum: 60 }, :strict => true
  validates :description, length: { maximum: 255 }, :strict => true
  validates_uniqueness_of :name, :strict => true, :scope => [:entity_id]
  validates_presence_of :col_type, :strict => true
  
  attr_accessor :max, :min, :editable, :trimable, :search_rank, :sort_rank, :reverse_sort
  
end
