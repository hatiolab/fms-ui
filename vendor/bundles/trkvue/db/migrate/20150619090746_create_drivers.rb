class CreateDrivers < ActiveRecord::Migration

	def change
		create_table :drivers  do |t|
			t.references :domain, :null => false
			t.string :code, :null => false, :limit => 32
			t.string :name, :null => false, :limit => 64
			t.string :social_id, :limit => 32
			t.string :email, :limit => 64
			t.string :title, :limit => 32
			t.string :division, :limit => 32
			t.string :phone_no, :limit => 32
			t.string :mobile_no, :limit => 32
			t.string :address, :limit => 255
			t.float :work_time, :default => 0
			t.float :distance, :default => 0
			t.integer :point, :default => 0
			t.string :img, :limit => 255
			t.userstamps
			t.timestamps
		end

		add_index :drivers, [:domain_id,:code], :unique => true, :name => :ix_drivers_0
		add_index :drivers, [:domain_id, :social_id], :name => :ix_drivers_1
    add_index :drivers, [:domain_id, :title], :name => :ix_drivers_2
    add_index :drivers, [:domain_id, :division], :name => :ix_drivers_3
	end

end
