class ReportParam < ActiveRecord::Base
  
  belongs_to :report

  default_scope { order("rank ASC") }

end
