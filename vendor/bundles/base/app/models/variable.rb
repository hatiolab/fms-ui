class Variable < ActiveRecord::Base
  
  include Multitenant
  
  strip_cols [:name]
	stampable
  
  validates_presence_of :name, :strict => true
  validates_presence_of :category, :strict => true
  validates :name, length: { maximum: 60 }, :strict => true
  validates :description, length: { maximum: 255 }, :strict => true
  validates_uniqueness_of :name, :strict => true, :scope => :domain_id  

  def execute on
    on.instance_eval self.logic
  end
end
