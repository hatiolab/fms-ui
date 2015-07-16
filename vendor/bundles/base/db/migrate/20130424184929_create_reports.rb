class CreateReports < ActiveRecord::Migration
  def change
    create_table :reports do |t|
      t.references :domain, :null => false
			t.string :name, :null => false
			t.string :description
      t.string :template
			t.userstamps
			t.timestamps
			
    end

    add_index :reports, [:domain_id, :name], :unique => false, :name => :ix_reports_0		
  end
end
