# This migration comes from base_engine (originally 20130422120102)
class CreateAttachments < ActiveRecord::Migration
  def	change
    create_table :attachments  do |t|
      t.references :domain, :null => false
      t.string :name, :null => false, :limit => 64
      t.string :description, :limit => 255
      t.string :mimetype, :limit => 10
      t.integer :file_size
      t.string :path, :limit => 2000
      t.references :on, :polymorphic => true
      t.string :tag, :limit => 2000
      t.userstamps
      t.timestamps
    end
    
		add_index :attachments, [:domain_id, :on_type, :on_id, :tag, :name], :unique => true, :name => :ix_attach_0
  end
end
