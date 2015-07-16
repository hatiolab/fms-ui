module Hatio
  module ExtensionLogic
    
    def self.included(base)
      super
      base.extend(ClassMethods)
      base.class_eval do
        include InstanceMethods
      end
    end

    module ClassMethods
      def run_class_logic(logic_name, params)
        entity = Entity.find_by_name(self.name)
        raise Hatio::Exception::MisConfigured, (I18n.translate 'errors.messages.x_not_found', :x => "Entity (#{self.name})") unless entity
        logic = entity.entity_logics.where("level = ? and name = ?", :class.to_s, logic_name).first
        raise Hatio::Exception::MisConfigured, (I18n.translate 'errors.messages.x_not_found', :x => "EntityLogic (#{logic_name}) of Entity (#{self.name})") unless logic
        raise Hatio::Exception::MisConfigured, (I18n.translate 'errors.messages.empty_x_not_allowed', :x => "EntityLogic (#{logic_name}) of Entity (#{self.name})") if (logic.logic.nil? || logic.logic.empty?)
        return self.instance_eval logic.logic
      end
    end

    module InstanceMethods
      public
        def run_instance_logic(logic_name, params)
          entity = Entity.find_by_name(self.class.name)
          raise Hatio::Exception::MisConfigured, (I18n.translate 'errors.messages.x_not_found', :x => "Entity (#{self.class.name})") unless entity
          logic = entity.entity_logics.where("level = ? and name = ?", :instance.to_s, logic_name).first
          raise Hatio::Exception::MisConfigured, (I18n.translate 'errors.messages.x_not_found', :x => "EntityLogic (#{logic_name}) of Entity (#{self.class.name})") unless logic
          raise Hatio::Exception::MisConfigured, (I18n.translate 'errors.messages.empty_x_not_allowed', :x => "EntityLogic (#{logic_name}) of Entity (#{self.class.name})") if (logic.logic.nil? || logic.logic.empty?)
          return self.instance_eval logic.logic
        end
    end
    
  end
end
