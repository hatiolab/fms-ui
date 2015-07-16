module Hatio
  module Userstamp
    
    def self.included(base) #:nodoc:
      super
      base.extend(ClassMethods)
      base.class_eval do
        include InstanceMethods        
        class_attribute :creator_attribute
        class_attribute :updater_attribute
      end
    end

    module ClassMethods
      def stampable(options = {:creator_id => :creator_id, :updater_id => :updater_id})
        self.creator_attribute  = options[:creator_id]
        self.updater_attribute  = options[:updater_id]
                
        class_eval do
          belongs_to :creator, :class_name => "User", :foreign_key => self.creator_attribute
          belongs_to :updater, :class_name => "User", :foreign_key => self.updater_attribute                               
          before_save     :set_updater_attribute
          before_create   :set_creator_attribute
        end
      end
    end

    module InstanceMethods #:nodoc:
      public
        def creator_name
          self.creator ? self.creator.name : nil
        end

        def updater_name
          self.updater ? self.updater.name : nil    
        end
            
      private
        def set_creator_attribute
          self.creator_id = User.current_user.id if User.current_user && !self.creator_id
        end
        
        def set_updater_attribute
          self.updater_id = User.current_user.id if User.current_user && !self.updater_id
        end
    end
  end
end
