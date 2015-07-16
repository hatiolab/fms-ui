class CreateCodeExpansions < ActiveRecord::Migration

	def change
		create_table :code_expansions  do |t|
			t.references :domain, :null => false
			t.references :expansion_code
			t.string :data_1, :null => false, :limit => 255
			t.string :data_2, :limit => 255
			t.string :data_3, :limit => 255
			t.string :data_4, :limit => 255
			t.string :data_5, :limit => 255
			t.string :data_6, :limit => 255
			t.string :data_7, :limit => 255
			t.string :data_8, :limit => 255
			t.string :data_9, :limit => 255
			t.string :data_10, :limit => 255
			t.userstamps
			t.timestamps
		end

		add_index :code_expansions, [:domain_id, :expansion_code_id], :name => :ix_code_exp_0
	end

end
