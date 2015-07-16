class Property < ActiveRecord::Base
  
  include Multitenant
    
  stampable
  strip_cols [:name]

  belongs_to :on, polymorphic: true
  
end
