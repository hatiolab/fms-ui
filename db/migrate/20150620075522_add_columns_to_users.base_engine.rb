# This migration comes from base_engine (originally 20130419081039)
class AddColumnsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :name, :string, :limit => 64
    add_column :users, :locale, :string, :limit => 10
    add_column :users, :timezone, :string, :limit => 64
    # add_column :users, :default_domain_id, :string, :limit => 64
    add_column :users, :admin_flag, :boolean
    add_column :users, :operator_flag, :boolean
    add_column :users, :active_flag, :boolean
  end
end
