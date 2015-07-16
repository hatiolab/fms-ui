module <%= class_name %>
  class Engine < ::Rails::Engine
    # isolate_namespace <%= class_name %>
    paths["db/migrate"] << "db/migrate"
    paths["db/seeds.rb"] << "db/seeds.rb"    
  end
end
