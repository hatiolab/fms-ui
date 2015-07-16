class CreateMenuParams < ActiveRecord::Migration

	def change
		create_table :menu_params  do |t|
			t.references :menu
			t.string :name, :null => false, :limit => 32
			t.string :description, :null => false, :limit => 255
			t.string :value, :null => false, :limit => 4000
		end

		add_index :menu_params, [:menu_id,:name], :unique => true, :name => :ix_menu_params_0
	end

end
