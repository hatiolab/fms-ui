# This migration comes from trkvue_engine (originally 20150619170000)
class AddDomainToUsers < ActiveRecord::Migration
  def change
    add_column :users, :domain_id, :string, :limit => 32
  end
end