class CreateSettings < ActiveRecord::Migration

	def change
		create_table :settings  do |t|
			t.references :domain, :null => false
			t.boolean :global_flag
			t.string :name, :null => false, :limit => 64
			t.string :description, :limit => 255
			t.text :value, :null => false
			t.userstamps
			t.timestamps
		end

		add_index :settings, [:domain_id,:name], :unique => true, :name => :ix_settings_0
		add_index :settings, [:domain_id, :updated_at], :name => :ix_settings_1
	end

end
