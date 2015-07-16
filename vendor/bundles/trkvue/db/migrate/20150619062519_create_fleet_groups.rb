class CreateFleetGroups < ActiveRecord::Migration

	def change
		create_table :fleet_groups  do |t|
			t.references :domain, :null => false
			t.string :name, :null => false, :limit => 32
			t.string :description, :limit => 255
			t.userstamps
			t.timestamps
		end

		add_index :fleet_groups, [:domain_id,:name], :unique => true, :name => :ix_fleet_groups_0
	end

end
