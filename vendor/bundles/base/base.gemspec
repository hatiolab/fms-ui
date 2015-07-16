# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'base/version'

Gem::Specification.new do |gem|
  gem.name          = "base"
  gem.version       = Base::VERSION
  gem.authors       = ["hatiolab"]
  gem.email         = ["admin@hatiolab.com"]
  gem.description   = %q{Base bundle for Hatio,Lab. Application}
  gem.summary       = %q{Base bundle for Hatio,Lab. Application}
  gem.homepage      = "http://www.hatiolab.com"

  gem.files         = `git ls-files`.split($/)
  gem.executables   = gem.files.grep(%r{^bin/}).map{ |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(test|spec|features)/})
  gem.require_paths = ["lib"]
end