class CreateDomains < ActiveRecord::Migration
  def self.up
    create_table :domains do |t|
      t.string :name, :null => false, :limit => 32
      t.string :description, :limit => 255    
      t.string :timezone, :limit => 255
      t.boolean :system_flag
      t.string :subdomain, :limit => 32
      t.string :brand_name, :limit => 64
      t.string :brand_image, :limit => 255
      t.string :content_image, :limit => 255
      t.userstamps
      t.timestamps
    end
  end

  def self.down
    drop_table :domains
  end
end
