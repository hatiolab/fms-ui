module Hatio
  module Stripper
    
    def self.included(base)
      super
      base.extend(ClassMethods)
      base.class_eval do
        include InstanceMethods
        class_attribute :strip_fields
      end
    end

    module ClassMethods
      def strip_cols(cols)
        class_eval do
          self.strip_fields  = cols
          before_validation :strip_vals
        end
      end
    end

    module InstanceMethods
      private
        def strip_vals
          assign_attrs = {}
          self.strip_fields.each do |col|
            val = self.attributes[col.to_s]
            val = val.strip if(val && val.respond_to?(:strip))
            assign_attrs[col.to_s] = val
          end
          
          self.assign_attributes(assign_attrs) unless(assign_attrs.empty?)
        end
    end
    
  end
end
