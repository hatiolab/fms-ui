# This migration comes from base_engine (originally 20130424170933)
class CreateDiyServices < ActiveRecord::Migration
  def	self.up
    create_table :diy_services do |t|
      t.references :domain, :null => false
			t.string :name, :null => false, :limit => 64
			t.string :description, :limit => 255
			t.string :script_type, :limit => 10
			t.boolean :active_flag
			t.text :service_logic
			t.boolean :atomic_flag
			t.userstamps
			t.timestamps
    end

    add_index :diy_services, [:domain_id, :name], :unique => true, :name => :ix_diy_svc_0
  end

  def self.down
    remove_index :diy_services, :name => :ix_diy_svc_0
		
    drop_table :diy_services
  end
end