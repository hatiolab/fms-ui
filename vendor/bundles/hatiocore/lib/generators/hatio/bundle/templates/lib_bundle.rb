require "<%= @bundle_name %>/version"
require "<%= @bundle_name %>/engine"
require "<%= @bundle_name %>/pluggable_spot"

# module <%= class_name %>
  # Your code goes here...
# end

Hatio::Bundle.new '<%= @bundle_name %>', 1.0 do |bundle|
  bundle.dependencies = ['base']
  bundle.bootstrap_controllers = ['<%= class_name %>.controller.<%= class_name %>Controller']
end