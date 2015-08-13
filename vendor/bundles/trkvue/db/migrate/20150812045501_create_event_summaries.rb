class CreateEventSummaries < ActiveRecord::Migration

	def change
		create_table :event_summaries  do |t|
			t.references :domain, :null => false
			t.references :fleet
			t.string :sum_day, :null => false, :limit => 10
			t.string :sum_year, :null => false, :limit => 4
			t.string :sum_month, :null => false, :limit => 2
			t.string :sum_week, :null => false, :limit => 3
			t.integer :impact, :default => 0
			t.integer :geofence, :default => 0
			t.integer :emergency, :default => 0
			t.integer :gsensor, :default => 0
			t.integer :overspeed, :default => 0
			t.userstamps
			t.timestamps
		end

		add_index :event_summaries, [:domain_id,:fleet_id,:sum_day], :unique => true, :name => :ix_event_sum_0
		add_index :event_summaries, [:domain_id, :fleet_id], :name => :ix_event_sum_1
		add_index :event_summaries, [:domain_id, :sum_day], :name => :ix_event_sum_2
		add_index :event_summaries, [:domain_id, :sum_year, :sum_month], :name => :ix_event_sum_3
	end

end
