# This migration comes from base_engine (originally 20130421104000)
class CreateMenus < ActiveRecord::Migration
  def	self.up
    create_table :menus do |t|
			t.references :domain, :null => false
      t.string :name, :null => false, :limit => 64
			t.string :description, :limit => 255
			t.references :parent, :class_name => :Menu
			t.string :template, :limit => 128
			t.string :menu_type, :limit => 20
			t.string :category, :limit => 64
			t.integer :rank, :default => 100
			t.string :icon_path, :limit => 255
			t.boolean :hidden_flag, :default => false
			t.userstamps
			t.timestamps
			
    end

    add_index :menus, [:domain_id, :parent_id, :name], :unique => true, :name => :ix_menu_0
    add_index :menus, [:parent_id], :name => :ix_menu_1
    add_index :menus, [:domain_id, :menu_type], :name => :ix_menu_2
		
  end

  def self.down
    remove_index :menus, :name => :ix_menu_0
		remove_index :menus, :name => :ix_menu_1
		remove_index :menus, :name => :ix_menu_2
		
    drop_table :menus
  end
end