class CalendarDate < ActiveRecord::Base
  include Multitenant
    
  belongs_to :calendar
  
  def title
    "#{self.sys_date}"
  end
  
  def start
    "#{self.sys_date} 00:00:00"
  end
  
  def end
    "#{self.sys_date} 23:59:59"
  end
  
  def cid
    "1"
  end
  
  def ad
    true
  end
  
end