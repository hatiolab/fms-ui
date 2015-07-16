# TODO 무엇을 위한 설정인가 ?
# module ActionDispatch::Session::Compatibility  
#   def initialize(app, options = {})
#     options[:key] ||= '_session_id'
#     options[:secret] ||= Rails.application.config.secret_token
#     super
#   end
# end

# Development mode시에 public/assets 스태틱 라우팅을 Disable 시킨다.
# 이렇게 하지 않으면, development 모드에서 이중으로 스크립트들이 로드되는 문제가 발생한다.
# class ActionDispatch::Static
#   def call(env)
#     case env['REQUEST_METHOD']
#     when 'GET', 'HEAD'
#       path = env['PATH_INFO'].chomp('/')
# 
#       unless Rails.application.config.consider_all_requests_local && path.starts_with?('/assets/')
#         if match = @file_handler.match?(path)
#           env["PATH_INFO"] = match
#           return @file_handler.call(env)
#         end
#       end
#     end
# 
#     @app.call(env)
#   end
# end
