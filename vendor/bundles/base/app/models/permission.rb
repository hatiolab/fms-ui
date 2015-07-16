class Permission < ActiveRecord::Base
  
		stampable
		
		belongs_to :role
		belongs_to :resource, :polymorphic => true
		
    # attr_accessible :action_name,:method_name
		
    def check_action_name
      return true unless self.action_name.blank?
      false
    end

    def check_method_name
      return true unless self.method_name.blank?
      false
    end
end
