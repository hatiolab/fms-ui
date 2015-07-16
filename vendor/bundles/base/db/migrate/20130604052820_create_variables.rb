class CreateVariables < ActiveRecord::Migration
  def change
    create_table :variables do |t|
      t.references :domain, :null => false
			t.string :name, :null => false
			t.string :description
			t.string :category
      t.text :logic
			t.userstamps
			t.timestamps
			
    end

    add_index :variables, [:domain_id, :name], :unique => true, :name => :ix_variables_0		
  end
end
