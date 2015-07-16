class CreateGeofenceGroups < ActiveRecord::Migration

	def change
		create_table :geofence_groups  do |t|
			t.references :domain
			t.references :fleet_group
			t.references :geofence
			t.string :alarm_type, :limit => 10
			t.userstamps
			t.timestamps
		end

		add_index :geofence_groups, [:fleet_group_id, :geofence_id], :name => :ix_geofence_groups_0
	end

end
