# This migration comes from base_engine (originally 20140710023216)
class CreateChits < ActiveRecord::Migration

	def change
		create_table :chits  do |t|
			t.references :domain, :null => false
			t.references :entity
			t.string :name, :null => false, :limit => 64
			t.string :description, :null => false, :limit => 255
			t.text :template
			t.text :logic
			t.userstamps
			t.timestamps
		end

		add_index :chits, [:domain_id,:entity_id,:name], :unique => true, :name => :ix_chits_0
	end

end
