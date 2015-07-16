class AddDomainToUsers < ActiveRecord::Migration
  def change
    add_column :users, :domain_id, :string, :limit => 32
  end
end