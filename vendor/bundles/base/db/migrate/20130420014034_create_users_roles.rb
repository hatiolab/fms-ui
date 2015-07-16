class CreateUsersRoles < ActiveRecord::Migration
  def	self.up
    create_table :users_roles, :id => false do |t|
      t.references :user, :null => false
			t.references :role, :null => false
    end

    add_index :users_roles, [:user_id, :role_id], :name => :ix_user_role_0, :unique => true
    add_index :users_roles, [:role_id, :user_id], :name => :ix_user_role_1    
  end

  def self.down
    remove_index :users_roles, :name => :ix_user_role_0
    remove_index :users_roles, :name => :ix_user_role_1
    
    drop_table :users_roles
  end
end