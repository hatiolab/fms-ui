# This migration comes from trkvue_engine (originally 20150812042624)
class CreateFleetGroupSummaries < ActiveRecord::Migration

	def change
		create_table :fleet_group_summaries  do |t|
			t.references :domain, :null => false
			t.references :fleet_group
			t.string :sum_day, :null => false, :limit => 10
			t.string :sum_year, :null => false, :limit => 4
			t.string :sum_month, :null => false, :limit => 2
			t.string :sum_week, :null => false, :limit => 3
			t.float :velocity, :default => 0
			t.float :drive_dist, :default => 0
			t.float :drive_time, :default => 0
			t.integer :impact, :default => 0
			t.integer :geofence, :default => 0
			t.integer :emergency, :default => 0
			t.integer :gsensor, :default => 0
			t.integer :overspeed, :default => 0
			t.integer :speed_off, :default => 0
			t.integer :speed_idle, :default => 0
			t.integer :speed_slow, :default => 0
			t.integer :speed_normal, :default => 0
			t.integer :speed_high, :default => 0
			t.integer :speed_over, :default => 0
			t.userstamps
			t.timestamps
		end

		add_index :fleet_group_summaries, [:domain_id,:fleet_group_id,:sum_day], :unique => true, :name => :ix_fleet_group_sum_0
		add_index :fleet_group_summaries, [:domain_id, :fleet_group_id], :name => :ix_fleet_group_sum_1
		add_index :fleet_group_summaries, [:domain_id, :sum_day], :name => :ix_fleet_group_sum_2
		add_index :fleet_group_summaries, [:domain_id, :sum_year, :sum_month], :name => :ix_fleet_group_sum_3
	end

end
