require 'hatiocore/engine'
require 'hatiocore/version'
require 'hatiocore/engine'

require 'hatiocore/pluggable/pluggable_spot'
require 'hatiocore/action_controller/search_helper'
require 'hatiocore/patch/string_key'
require 'hatiocore/patch/actionpack_hatio_patch'
require 'hatiocore/patch/date'
require 'hatiocore/active_record/stripper'
require 'hatiocore/active_record/stringified_id'
require 'hatiocore/active_record/userstamp'
require 'hatiocore/active_record/rem_tracker'
require 'hatiocore/active_record/extension_logic'
require 'hatiocore/util/hatio_util'
require 'hatiocore/bundle/hatio_bundle'
require 'hatiocore/exception/exceptions'
# require 'hatiocore/birt/birt_report'

include Hatio::Util::HatioUtil

ActiveRecord::Base.send :include, Hatio::Stripper
ActiveRecord::Base.send :include, Hatio::StringfiedID
ActiveRecord::Base.send :include, Hatio::Userstamp
ActiveRecord::Base.send :include, Hatio::RemTracker
ActiveRecord::Base.send :include, Hatio::ExtensionLogic
ActionController::Base.send :include, Hatio::SearchHelper

puts "Things Framework Loaded!"

Hatio::Bundle.new 'hatiocore', 1.0 do |bundle|
  bundle.dependencies = []
end
