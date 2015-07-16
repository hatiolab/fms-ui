<%= Hatio::Generators::ApiUtil.generate_show_json_builder(singular_name, @attributes) %>
<%= Hatio::Generators::ApiUtil.generate_ref_entity_json_builder(singular_name, @biz_attrs) %>
<%= Hatio::Generators::ApiUtil.generate_userstamp_json_builder(singular_name, @attributes) %>