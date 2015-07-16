require "trkvue/version"
require "trkvue/engine"
require "trkvue/pluggable_spot"

# module Trkvue
  # Your code goes here...
# end

Hatio::Bundle.new 'trkvue', 1.0 do |bundle|
  bundle.dependencies = ['base']
  bundle.bootstrap_controllers = ['Trkvue.controller.TrkvueController']
end