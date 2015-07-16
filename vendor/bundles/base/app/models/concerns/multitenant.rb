module Multitenant
  extend ActiveSupport::Concern

  included do
    belongs_to :domain
  
    default_scope { where(domain_id: Domain.current_domain.id) }
  end

end