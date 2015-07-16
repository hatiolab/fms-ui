module Trkvue
  class Engine < ::Rails::Engine
    # isolate_namespace Trkvue
    paths["db/migrate"] << "db/migrate"
    paths["db/seeds.rb"] << "db/seeds.rb"    
  end
end
