# This migration comes from base_engine (originally 20150215083118)
class CreateExpansionCodes < ActiveRecord::Migration

	def change
		create_table :expansion_codes  do |t|
			t.references :domain, :null => false
			t.string :name, :null => false, :limit => 64
			t.string :description, :limit => 255
			t.userstamps
			t.timestamps
		end

		add_index :expansion_codes, [:domain_id, :name], :unique => true, :name => :ix_exp_code_0
	end

end
