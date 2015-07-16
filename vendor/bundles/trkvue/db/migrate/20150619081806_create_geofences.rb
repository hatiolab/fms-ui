class CreateGeofences < ActiveRecord::Migration

	def change
		create_table :geofences  do |t|
			t.references :domain, :null => false
			t.string :name, :null => false, :limit => 32
			t.string :description, :limit => 255
			t.userstamps
			t.timestamps
		end

		add_index :geofences, [:domain_id,:name], :unique => true, :name => :ix_geofences_0
	end

end
