class CreateServiceOutParams < ActiveRecord::Migration
  
  def	self.up
    create_table :service_out_params do |t|
      t.references :resource, :polymorphic => true
      t.string :name, :limit => 64
      t.string :description, :limit => 255
      t.integer :rank
    end

    add_index :service_out_params, [:resource_type, :resource_id], :unique => false, :name => :ix_svc_out_param_0
  end

  def self.down
    remove_index :service_out_params, :name => :ix_svc_out_param_0
    drop_table :service_out_params
  end
end