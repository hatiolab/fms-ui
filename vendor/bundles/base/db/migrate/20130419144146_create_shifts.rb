class CreateShifts < ActiveRecord::Migration

	def self.up
		create_table :shifts do |t|
			t.references :domain, :null => false
			t.string :name, :limit => 32
      t.boolean :default_flag
			t.integer :total_shift, :limit => 2
			t.string :shift1_start, :limit => 8
			t.string :shift2_start, :limit => 8
			t.string :shift3_start, :limit => 8
			t.string :shift1_end, :limit => 8
			t.string :shift2_end, :limit => 8
			t.string :shift3_end, :limit => 8
			t.integer :shift1_start_add, :limit => 2, :default => 0
			t.integer :shift1_end_add, :limit => 2, :default => 0 
			t.integer :shift2_start_add, :limit => 2, :default => 0 
			t.integer :shift2_end_add, :limit => 2, :default => 0 
			t.integer :shift3_start_add, :limit => 2, :default => 0 
			t.integer :shift3_end_add, :limit => 2, :default => 0
		end
		
		add_index :shifts, [:domain_id, :name], :unique => true, :name => :ix_shift_0
	end

	def self.down
	  remove_index :shifts, :name => :ix_shift_0
		drop_table :shifts
	end
end