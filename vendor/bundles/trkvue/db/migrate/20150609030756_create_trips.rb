class CreateTrips < ActiveRecord::Migration

	def change
		create_table :trips do |t|
			t.string :dom, :null => false, :limit => 32
			t.string :bid, :null => false, :limit => 32
			t.string :fid, :null => false, :limit => 32
			t.string :fvr, :null => false, :limit => 32
			t.string :did, :null => false, :limit => 32
			t.string :sts, :null => false, :limit => 1
			t.float :s_lat, :null => false
			t.float :s_lng, :null => false
			t.float :lat
			t.float :lng
			t.integer :c_off
			t.integer :c_idl
			t.integer :c_low
			t.integer :c_nml
			t.integer :c_hgh
			t.integer :c_ovr
			t.integer :stm, :null => false
			t.integer :etm, :null => false
			t.integer :utm, :null => false
		end

		add_index :trips, [:id], :unique => true, :name => :ix_trip_0
	end

end
