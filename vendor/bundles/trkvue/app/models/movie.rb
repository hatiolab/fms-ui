class Movie < ActiveRecord::Base

	include Multitenant

	stampable

	validates_presence_of :event_id,:total_size,:start_byte,:chunk_size,:chunk_count,:chunk_index,:file_path, :strict => true

	validates :event_id, length: { maximum: 32 }, :strict => true

	validates :file_path, length: { maximum: 255 }, :strict => true


end
