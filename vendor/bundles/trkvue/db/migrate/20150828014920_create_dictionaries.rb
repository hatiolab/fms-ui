class CreateDictionaries < ActiveRecord::Migration

	def change
		create_table :dictionaries  do |t|
			t.references :domain, :null => false
			t.string :name, :null => false, :limit => 255
			t.string :description, :limit => 1000
			t.string :locale, :null => false, :limit => 10
			t.string :category, :null => false, :limit => 20
			t.string :display, :limit => 1000
			t.userstamps
			t.timestamps
		end

		add_index :dictionaries, [:domain_id,:locale,:category,:name], :unique => true, :name => :ix_dic_0
		add_index :dictionaries, [:domain_id,:locale], :name => :ix_dic_1
		add_index :dictionaries, [:domain_id,:locale,:category], :name => :ix_dic_2
	end

end
