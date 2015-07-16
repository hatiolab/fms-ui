class Contact < ActiveRecord::Base
  include Multitenant
  include Attachable
  include PropertyKeepable
  
	stampable
  strip_cols [:family_name, :given_name, :company, :department, :title, :email, :phone_office, :phone_mobile, :fax, :address]
  removing_trackable

  before_save :update_contact_attributes
  
  def update_contact_attributes
    self.name = [self.given_name, self.family_name].compact.join(' ').strip
  end

end
