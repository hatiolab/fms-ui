module Hatio
  module Exception
    class HatioError < StandardError; end

    class InsufficientParameter < HatioError; end
  
    class MisConfigured < HatioError; end
  
    class ResourceNotFound < HatioError; end
    
    class ServerError < HatioError; end
    
    class InvalidRequest < HatioError; end
    
    class ValidationWarning < HatioError; end

    @status_code_map = {
      'ActiveRecord::RecordNotUnique' => :internal_server_error,
      'ActiveRecord::RecordNotFound' => :not_found,
      'ActiveRecord::StatementInvalid' => :internal_server_error,
      'Hatio::Exception::ResourceNotFound' => :not_found,
      'Hatio::Exception::InsufficientParameter' => :bad_request,
      'Hatio::Exception::MisConfigured' => :internal_server_error,
      'Hatio::Exception::ServerError' => :internal_server_error,
      'Hatio::Exception::InvalidRequest' => :bad_request,
      'Hatio::Exception::ValidationWarning' => :bad_request
    }
  
    def self.get_status_code e
      @status_code_map[e.class.name] || :internal_server_error
    end
  end
end