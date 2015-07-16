module Hatio
  module RemTracker
    
    def self.included(base)
      super
      base.extend(ClassMethods)
      base.class_eval do
        include InstanceMethods
      end
    end

    module ClassMethods
      def removing_trackable
        class_eval do
          after_destroy :trace_removing
        end
      end
    end

    module InstanceMethods
      private
        def trace_removing
          # self 정보를 모두 REM_TRACES 테이블에 추가 
          rem_trace = RemTrace.new
          rem_trace.name = self.name if(self.respond_to?(:name))
          rem_trace.entity_type = self.class.name
          rem_trace.entity_id = self.id
          rem_trace.content = self.to_json
          rem_trace.domain_id = self.domain_id
          rem_trace.save!
        end
    end
    
  end
end
