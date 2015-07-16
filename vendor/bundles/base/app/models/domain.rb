class Domain < ActiveRecord::Base
  
  validates_presence_of :name
  validates_uniqueness_of :name, :case_sensitive => false
  
  stampable

  mount_uploader :brand_image, FileUploader
  mount_uploader :content_image, FileUploader
  
  has_one :shift

  def self.system_domain
    Domain.find_by_system_flag(true)
  end

  #
  # Pluggable model dinamic loading
  #
  Hatio::PluggableSpot::DOMAIN_MODEL_PLUGGABLES.each do |pluggable_code|
    self.class_eval &pluggable_code
  end
  
  class << self
    def current_domain=(domain)
      Thread.current[:current_domain] = domain
    end

    def current_domain
      Thread.current[:current_domain]
    end
  end  
end
