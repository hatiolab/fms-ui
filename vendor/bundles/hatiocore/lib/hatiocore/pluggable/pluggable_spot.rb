module Hatio
  module PluggableSpot
    # Pluggable Spot for Domain Model
    DOMAIN_MODEL_PLUGGABLES = []
    AFTER_PLUGIN_LOAD = []
    
    def self.after_plugin_load(&block)
      if defined? ActiveRecord::Base
        return unless ActiveRecord::Base.connection.table_exists?("schema_migrations") # for settings table...
      end
      if block_given?
        AFTER_PLUGIN_LOAD << block
      end
    end
    
    def self.add_domain_pluggable(&block)
      if block_given?
        DOMAIN_MODEL_PLUGGABLES << block
      end
    end
  end
end
