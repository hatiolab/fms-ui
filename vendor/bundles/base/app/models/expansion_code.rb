class ExpansionCode < ActiveRecord::Base

	include Multitenant

	stampable

	strip_cols [:name]

	validates_presence_of :name, :strict => true

	validates :name, length: { maximum: 64 }, :strict => true

	validates :description, length: { maximum: 255 }, :strict => true

	validates_uniqueness_of :name, :strict => true, :scope => [:domain_id]
  
  has_many :expansion_code_items, -> { order('bind_index asc') }, :dependent => :destroy
  
  has_many :code_expansions, -> { order('data_1 asc') }, :dependent => :destroy
  
  validates_associated :expansion_code_items
  
  validates_associated :code_expansions

end
