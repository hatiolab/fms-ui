class CreateProperties < ActiveRecord::Migration
  def	change
    create_table :properties  do |t|
      t.references :domain, :null => false
      t.string :name, :null => false, :limit => 64
      t.string :description, :limit => 255
      t.string :value
      t.references :on, :polymorphic => true
      t.userstamps
      t.timestamps
    end
    
		add_index :properties, [:domain_id, :on_type, :on_id, :name], :unique => true, :name => :ix_property_0
  end
end
