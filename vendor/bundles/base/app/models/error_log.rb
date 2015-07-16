class ErrorLog < ActiveRecord::Base

	include Multitenant

	validates_presence_of :issue_date, :strict => true

	validates :status, length: { maximum: 16 }, :strict => true

	validates :error_type, length: { maximum: 128 }, :strict => true

	validates :message, length: { maximum: 1000 }, :strict => true

	validates :uri, length: { maximum: 1000 }, :strict => true

  belongs_to :creator, :class_name => "User", :foreign_key => "creator_id"
end
