class CreateCalendars < ActiveRecord::Migration
  
  def self.up
    create_table :calendars do |t|
      t.references :domain, :null => false
      t.string :name, :null => false, :limit => 64
      t.string :description, :limit => 255
      t.boolean :day1_off_flag
      t.boolean :day2_off_flag
      t.boolean :day3_off_flag
      t.boolean :day4_off_flag
      t.boolean :day5_off_flag
      t.boolean :day6_off_flag
      t.boolean :day7_off_flag
      t.float :day1_workhour
      t.float :day2_workhour
      t.float :day3_workhour
      t.float :day4_workhour
      t.float :day5_workhour
      t.float :day6_workhour
      t.float :day7_workhour
      t.userstamps
      t.timestamps
    end
    
		add_index :calendars, [:domain_id, :name], :unique => true, :name => :ix_calendar_0
  end

  def self.down
    remove_index :calendars, :name => :ix_calendar_0
    drop_table :calendars
  end
end
