class CreateExpansionCodeItems < ActiveRecord::Migration

	def change
		create_table :expansion_code_items  do |t|
			t.references :expansion_code
			t.string :name, :null => false, :limit => 64
			t.string :description, :null => false, :limit => 255
			t.integer :bind_index, :null => false
			t.boolean :unique_flag
			t.string :ref_type, :limit => 20
			t.string :ref_name, :limit => 64
			t.string :col_type, :null => false, :limit => 20
			t.integer :col_size
			t.boolean :nullable
		end

		add_index :expansion_code_items, [:expansion_code_id,:name], :unique => true, :name => :ix_exp_code_item_0
	end

end
