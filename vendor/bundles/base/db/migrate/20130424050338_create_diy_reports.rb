class CreateDiyReports < ActiveRecord::Migration

	def  self.up
		create_table :diy_reports do |t|
			t.references :domain, :null => false
			t.string :name, :null => false, :limit => 64
			t.string :description, :limit => 255
			t.references :diy_selection
			t.userstamps
			t.timestamps
		end

		add_index :diy_reports, [:domain_id, :name], :name => :ix_diy_report_0
		add_index :diy_reports, [:diy_selection_id], :name => :ix_diy_report_1
	end

	def  self.down
		remove_index :diy_reports, :name => :ix_diy_report_0
		remove_index :diy_reports, :name => :ix_diy_report_1
		
		drop_table :diy_reports
	end
end