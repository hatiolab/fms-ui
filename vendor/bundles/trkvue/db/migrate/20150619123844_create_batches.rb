class CreateBatches < ActiveRecord::Migration

	def change
		create_table :batches  do |t|
			t.string :tid, :null => false
			t.float :vlc, :null => false
			t.float :a_vlc, :null => false
			t.float :dst, :null => false
			t.float :s_lat, :null => false
			t.float :s_lng, :null => false
			t.float :lat, :null => false
			t.float :lng, :null => false
			t.integer :c_off, :null => false
			t.integer :c_idl, :null => false
			t.integer :c_low, :null => false
			t.integer :c_nml, :null => false
			t.integer :c_hgh, :null => false
			t.integer :c_ovr, :null => false
			t.integer :stm, :null => false
			t.integer :etm, :null => false
			t.integer :utm, :null => false
		end

		add_index :batches, [:id], :unique => true, :name => :ix_batch_0
	end

end
