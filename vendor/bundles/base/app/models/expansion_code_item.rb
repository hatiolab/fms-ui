class ExpansionCodeItem < ActiveRecord::Base

	validates_presence_of :expansion_code_id,:name,:description,:bind_index,:col_type, :strict => true

	validates :name, length: { maximum: 64 }, :strict => true

	validates :description, length: { maximum: 255 }, :strict => true

	validates :ref_type, length: { maximum: 20 }, :strict => true

	validates :ref_name, length: { maximum: 64 }, :strict => true

	validates :col_type, length: { maximum: 20 }, :strict => true

	validates_uniqueness_of :name, :strict => true, :scope => [:expansion_code_id]

	belongs_to :expansion_code

end
