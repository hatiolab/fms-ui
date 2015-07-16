class <%= class_name %> < ActiveRecord::Base
<%= Hatio::Generators::ModelUtil.generate_model(options, @attributes, @biz_attrs) %>
end