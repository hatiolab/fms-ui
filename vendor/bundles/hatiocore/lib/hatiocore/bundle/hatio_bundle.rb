module Hatio
  $HATIO_BUNDLES = [] unless defined? $HATIO_BUNDLES

  class Bundle
    attr_accessor :name, :module, :version, :summary, :author, :email, :url, :description, :changes, :entities, :dependencies, :bootstrap_controllers
    
    def initialize(name, version)
      self.name = name
      self.version = version
      self.module = Kernel.const_get(name.capitalize)
      self.entities = []
      self.dependencies = []
      self.bootstrap_controllers = []
      
      yield self if block_given?

      $HATIO_BUNDLES << self
    end
    
    def self.ordered_bundle_list
      ordered_list = []
      $HATIO_BUNDLES.each do |bundle|
        ordering_bundles bundle, ordered_list
      end
      ordered_list
    end

    def self.ordering_bundles bundle, ordered_list
      return if ordered_list.include? bundle
      bundle.dependencies.each do |dep|
        dep_bundle = $HATIO_BUNDLES.detect{|b| b.name == dep}
        ordering_bundles dep_bundle, ordered_list if dep_bundle
      end
      ordered_list << bundle unless ordered_list.include? bundle
    end
  end
end
