# This migration comes from trkvue_engine (originally 20150609031850)
# This migration comes from trkvue_engine (originally 20150609031850)
class CreateFleets < ActiveRecord::Migration

	def change
		create_table :fleets do |t|
      t.references :domain, :null => false
      t.string :name, :limit => 32
			t.string :device_name, :limit => 32
			t.string :device_model, :limit => 32
			t.string :driver_id, :null => false, :limit => 32
			t.string :car_no, :limit => 32
			t.string :car_model, :limit => 32
			t.string :car_image, :limit => 255
			t.references :fleet_group
			t.string :purchase_date, :limit => 10
			t.string :reg_date, :limit => 10
			t.float :lat, :null => false
			t.float :lng, :null => false
			t.string :status, :null => false
			t.float :velocity, :default => 0
			t.float :drive_time, :default => 0
			t.float :drive_dist, :default => 0			
			t.string :trip_id, :limit => 32
			t.string :batch_id, :limit => 32
			t.string :track_id, :limit => 32
			t.timestamp :last_trip_time
			t.userstamps
			t.timestamps
		end

		add_index :fleets, [:domain_id, :name], :unique => true, :name => :ix_fleets_0
		add_index :fleets, [:driver_id], :name => :ix_fleets_1
		add_index :fleets, [:domain_id, :fleet_group_id], :name => :ix_fleets_2
		add_index :fleets, [:domain_id, :velocity], :name => :ix_fleets_3
	end

end
