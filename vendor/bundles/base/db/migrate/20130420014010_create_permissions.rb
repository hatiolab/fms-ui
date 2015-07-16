class CreatePermissions < ActiveRecord::Migration
  def	self.up
    create_table :permissions do |t|
      t.references :role, :null => false
			t.references :resource, :polymorphic => true
			t.string :action_name, :limit => 64
			t.string :method_name, :limit => 64
			t.userstamps
			t.timestamps
			
    end

		add_index :permissions, [:role_id, :resource_type, :resource_id], :name => :ix_pmss_0
    add_index :permissions, [:resource_type, :resource_id, :role_id], :name => :ix_pmss_1
  end

  def self.down
	  remove_index :permissions, :name => :ix_pmss_0
    remove_index :permissions, :name => :ix_pmss_1
		
    drop_table :permissions
  end
end