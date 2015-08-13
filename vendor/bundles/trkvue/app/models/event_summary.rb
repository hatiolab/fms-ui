class EventSummary < ActiveRecord::Base

	include Multitenant

	stampable

	validates_presence_of :fleet_id,:sum_day,:sum_year,:sum_month,:sum_week, :strict => true

	validates :sum_day, length: { maximum: 10 }, :strict => true

	validates :sum_year, length: { maximum: 4 }, :strict => true

	validates :sum_month, length: { maximum: 2 }, :strict => true

	validates :sum_week, length: { maximum: 3 }, :strict => true

	validates_uniqueness_of :sum_day, :strict => true, :scope => [:domain_id,:fleet_id]

	belongs_to :fleet

end
