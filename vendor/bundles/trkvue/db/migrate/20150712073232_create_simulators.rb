class CreateSimulators < ActiveRecord::Migration

	def change
		create_table :simulators  do |t|
			t.references :domain, :null => false
			t.string :name, :null => false, :limit => 32
			t.string :description, :limit => 255
			t.string :type, :null => false, :limit => 20
			t.references :fleet_group
			t.references :fleet
			t.string :fleet_ver, :limit => 20
			t.string :url, :null => false, :limit => 255
			t.float :lat
			t.float :lng
			t.integer :total_count
			t.references :simulator_path
			t.integer :velocity
			t.integer :kick_counter
			t.float :gx
			t.float :gy
			t.float :gz
			t.string :event_type, :limit => 10
			t.string :severity, :limit => 10
			t.integer :stillcut_cycle
			t.integer :event_cycle
			t.string :stillcut_paths, :limit => 500
			t.float :invoke_cycle, :null => false
			t.string :movie_paths, :limit => 1000
			t.userstamps
			t.timestamps
		end

		add_index :simulators, [:domain_id,:name], :unique => true, :name => :ix_simulators_0
	end

end
