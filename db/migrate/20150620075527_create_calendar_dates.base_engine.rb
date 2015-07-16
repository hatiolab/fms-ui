# This migration comes from base_engine (originally 20130419180000)
class CreateCalendarDates < ActiveRecord::Migration
  
  def self.up
    create_table :calendar_dates do |t|
      t.references :domain, :null => false
      t.references :calendar, :null => false
      t.string :description, :limit => 255
      t.date :sys_date, :null => false
      t.integer :julian_day
      t.integer :plan_year
      t.integer :plan_quarter
      t.integer :plan_month
      t.integer :plan_week
      t.integer :iso_year
      t.integer :start_time
      t.decimal :work_hours, :precision => 15, :scale => 3
      
      (1..4).each do |shift|
        t.datetime :"shift#{shift}_start"
        t.datetime :"shift#{shift}_end"
      end
      
      t.integer :week_day
      t.boolean :dayoff_flag
      
      t.userstamps
      t.timestamps
    end
    
		add_index :calendar_dates, [:calendar_id, :sys_date], :unique => true, :name => :ix_calendar_date_0
		add_index :calendar_dates, [:calendar_id, :plan_year, :plan_month], :name => :ix_calendar_date_1
  end

  def self.down
    remove_index :calendar_dates, :name => :ix_calendar_date_0
    remove_index :calendar_dates, :name => :ix_calendar_date_1
    
    drop_table :calendar_dates
  end
end
