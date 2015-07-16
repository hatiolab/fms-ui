# This migration comes from trkvue_engine (originally 20150712071224)
class CreateSimulatorPaths < ActiveRecord::Migration

	def change
		create_table :simulator_paths  do |t|
			t.references :domain, :null => false
			t.string :name, :null => false, :limit => 32
			t.string :description, :limit => 255
			t.text :paths
			t.userstamps
			t.timestamps
		end

		add_index :simulator_paths, [:domain_id, :name], :unique => true, :name => :ix_simulator_paths_0
	end

end
