# This migration comes from trkvue_engine (originally 20150630051958)
class CreateMovies < ActiveRecord::Migration

	def change
		create_table :movies  do |t|
			t.references :domain, :null => false
			t.string :event_id, :null => false, :limit => 32
			t.integer :total_size, :null => false
			t.integer :start_byte, :null => false
			t.integer :chunk_size, :null => false
			t.integer :chunk_count, :null => false
			t.integer :chunk_index, :null => false
			t.string :file_path, :null => false, :limit => 255
			t.timestamps
		end

		add_index :movies, [:event_id], :name => :ix_movies_0
	end

end
