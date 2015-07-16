# This migration comes from base_engine (originally 20130424174929)
class CreateDiySelections < ActiveRecord::Migration
  def	self.up
    create_table :diy_selections do |t|
      t.references :domain, :null => false
			t.string :name, :null => false, :limit => 64
			t.string :description, :limit => 255
			t.string :script_type, :limit => 10
			t.text :service_logic
			t.userstamps
			t.timestamps
			
    end

    add_index :diy_selections, [:domain_id, :name], :unique => true, :name => :ix_diy_sel_0		
  end

  def self.down
    remove_index :diy_selections, :name => :ix_diy_sel_0
		
    drop_table :diy_selections
  end
end