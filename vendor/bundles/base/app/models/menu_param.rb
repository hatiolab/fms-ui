class MenuParam < ActiveRecord::Base

	strip_cols [:name]

	validates_presence_of :menu_id,:name,:value, :strict => true

	validates :name, length: { maximum: 32 }, :strict => true

	validates :description, length: { maximum: 255 }, :strict => true

	validates :value, length: { maximum: 4000 }, :strict => true

	validates_uniqueness_of :name, :strict => true, :scope => [:menu_id]

	belongs_to :menu

end
