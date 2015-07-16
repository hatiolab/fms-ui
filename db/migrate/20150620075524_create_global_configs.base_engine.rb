# This migration comes from base_engine (originally 20130419110000)
class CreateGlobalConfigs < ActiveRecord::Migration
  def self.up
    create_table :global_configs do |t|
			t.references :domain, :null => false
      t.string :name, :limit => 64, :null => false
      t.string :value, :limit => 2000
      t.timestamps
      t.userstamps
    end
  end

  def self.down
    drop_table :global_configs
  end
end
