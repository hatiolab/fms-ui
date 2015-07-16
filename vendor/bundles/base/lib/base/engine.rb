module Base
  class Engine < ::Rails::Engine
    # isolate_namespace Base
    paths["db/migrate"] << "db/migrate"
    paths["db/seeds.rb"] << "db/seeds.rb"
  end
end
