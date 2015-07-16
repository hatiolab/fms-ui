class CreateTerminologies < ActiveRecord::Migration
  
  def self.up
    create_table :terminologies  do |t|
			t.references :domain, :null => false
      t.string :name, :null => false, :limit => 255
      t.string :description, :limit => 4000
    
      t.string :locale, :limit => 15
    
      t.string :category, :limit => 20
      t.string :display, :limit => 1000
      t.string :display_short, :limit => 255

      t.userstamps
      t.timestamps
    end
    
    add_index :terminologies, [:domain_id, :locale, :category, :name], :unique => true, :name => :ix_terminologies_0
  end
end
