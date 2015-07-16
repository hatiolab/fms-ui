class CreateInfographics < ActiveRecord::Migration
  def change
    create_table :infographics do |t|
      t.references :domain, :null => false
			t.string :name, :null => false
			t.string :description
			t.string :infographic_type
			t.string :printer_type
			t.text :diagram
      t.text :print_command
			t.userstamps
			t.timestamps
			
    end

    add_index :infographics, [:domain_id, :name], :unique => true, :name => :ix_infographics_0		
  end
end
