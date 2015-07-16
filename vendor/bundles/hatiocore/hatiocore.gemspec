$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "hatiocore/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "hatiocore"
  s.version     = Hatiocore::VERSION
  s.authors     = ["HatioLab"]
  s.email       = ["heartyoh@hatiolab.com"]
  s.homepage    = "http://hatiolab.com"
  s.summary     = "HatioLab Application Core Library"
  s.description = "HatioLab Application Core Library"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  s.add_dependency "rails", "~> 4.2.0"
end
