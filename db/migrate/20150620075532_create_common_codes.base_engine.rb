# This migration comes from base_engine (originally 20130421070926)
class CreateCommonCodes < ActiveRecord::Migration

	def  self.up
		create_table :common_codes do |t|
			t.references :domain, :null => false
			t.string :name, :null => false, :limit => 64
			t.string :description, :limit => 255
			t.references :parent
			t.userstamps
			t.timestamps
		end

		add_index :common_codes, [:domain_id, :parent_id, :name], :unique => true, :name => :ix_common_cd_0
		add_index :common_codes, [:domain_id, :parent_id], :name => :ix_common_cd_1
	end

	def  self.down
		remove_index :common_codes, :name => :ix_common_cd_0
		remove_index :common_codes, :name => :ix_common_cd_1
		
		drop_table :common_codes
	end
end