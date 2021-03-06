module Basic
  extend ActiveSupport::Concern

  def set_current_user
    User.current_user = current_user 
    I18n.locale = cookies[:locale] || (current_user && current_user.locale ? User.current_user.locale : 'en-US')
  end

  def current_domain
    # @current_domain ||= Domain.find_by_subdomain!(request.subdomain.empty? ? 'system' : request.subdomain)
    # 위 코드 아래로 수정 
    @current_domain = User.current_user ? User.current_user.domain : Domain.system_domain
    @current_domain
  end
  
  def scope_current_domain(&block)
    Domain.current_domain = current_domain
    yield
  ensure
    Domain.current_domain = nil
  end

end