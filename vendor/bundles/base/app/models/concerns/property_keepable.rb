module PropertyKeepable
  extend ActiveSupport::Concern

  included do
    has_many :properties, :as => :on, :dependent => :destroy
  
    accepts_nested_attributes_for :properties
    
    def properties_attributes
      attrs = []
      entity = Entity.find_by_name(self.class.to_s)
      eprops = entity.entity_properties
      props = self.properties
      
      eprops.each do |ep|
        name = ep.name
        i = props.index { |p| p.name == name }
        if i.nil?
          attrs << self.properties.create(name: ep.name)
        else
          attrs << props[i]
        end
      end
      
      attrs
    end
  end

end
