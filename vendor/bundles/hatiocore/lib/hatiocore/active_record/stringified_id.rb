require 'uuidtools'

module Hatio
  module StringfiedID
    def self.included(base) #:nodoc:
      super

      base.extend(ClassMethods)
      base.class_eval do
        include InstanceMethods
        class_attribute :meaningful_composite_key
        class_attribute :meaningful_id_separator
        class_attribute :self_sequence_length
        class_attribute :self_sequence_block
      end
    end

    module ClassMethods

      def meaningful_id(composite = [:domain_id, :name], separator = nil, options = {})
        self.meaningful_composite_key = composite.clone
        self.meaningful_id_separator = separator

        composite.each do |field|
          validates_presence_of field
        end
        
        # Soft Delete 지원으로 이 부분은 수동으로 추가하는 것으로 변경 
        # validates_uniqueness_of composite.pop, :scope => composite
        
        before_create :set_meaningful_id
      end
      
      def universal_unique_id
        before_create :set_uuid_as_id
      end
      
      def self_sequence_id(seqlen = 16, composite = [:domain_id, ''], separator = nil, &block)
        self.meaningful_composite_key = composite.clone
        self.meaningful_id_separator = separator

        self.self_sequence_block = block
        self.self_sequence_length = seqlen

        before_create :set_self_sequence_as_id
      end
      
      def next_self_sequence(field, seqlen = 6, key = nil)
        key = yield if block_given?
        maxrec = self.find(:first, :select => "max(substr(#{field.to_s}, #{key.length + 1}, #{key.length + seqlen})) + 1 #{field.to_s}", :conditions => ["#{field.to_s} like ?", "#{key}%"])
        key + sprintf("%0#{seqlen}d", maxrec[field.to_sym].nil? ? 1 : maxrec[field.to_sym])
      end
    end

    module InstanceMethods #:nodoc:
      private
        def set_uuid_as_id
          self.id = generateUUID
          #self.id = Digest::SHA1.hexdigest(Time.now.to_s.split(//).sort_by {rand}.join).to_s
        end
        
        def set_meaningful_id
          self.id ||= self.meaningful(meaningful_composite_key, meaningful_id_separator)
        end

        def set_self_sequence_as_id
          self.id ||= if self_sequence_block.nil?
            self.class.next_self_sequence 'id', self_sequence_length, self.meaningful(meaningful_composite_key, meaningful_id_separator)
          else
            self.class.next_self_sequence 'id', self_sequence_length, &self_sequence_block
          end
        end
    end
  end
end
