class CodeExpansion < ActiveRecord::Base

	include Multitenant

	stampable

	strip_cols [:data_1]

	validates_presence_of :expansion_code_id,:data_1, :strict => true

	validates :data_1, length: { maximum: 255 }, :strict => true

	validates :data_2, length: { maximum: 255 }, :strict => true

	validates :data_3, length: { maximum: 255 }, :strict => true

	validates :data_4, length: { maximum: 255 }, :strict => true

	validates :data_5, length: { maximum: 255 }, :strict => true

	validates :data_6, length: { maximum: 255 }, :strict => true

	validates :data_7, length: { maximum: 255 }, :strict => true

	validates :data_8, length: { maximum: 255 }, :strict => true

	validates :data_9, length: { maximum: 255 }, :strict => true

	validates :data_10, length: { maximum: 255 }, :strict => true

	belongs_to :expansion_code

end
