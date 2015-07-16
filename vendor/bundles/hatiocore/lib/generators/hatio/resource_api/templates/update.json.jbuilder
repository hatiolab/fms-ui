<%= Hatio::Generators::ApiUtil.generate_single_json_builder(singular_name, @attributes) %>
<%= Hatio::Generators::ApiUtil.generate_ref_entity_json_builder(singular_name, @biz_attrs) %>