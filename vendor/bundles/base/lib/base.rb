require "base/version"
require "base/engine"
require "base/pluggable_spot"

# module Base
  # Your code goes here...
# end

Hatio::Bundle.new 'base', 1.0 do |bundle|
  bundle.dependencies = ['hatiocore']
  bundle.bootstrap_controllers = ['Base.controller.BaseController']
end