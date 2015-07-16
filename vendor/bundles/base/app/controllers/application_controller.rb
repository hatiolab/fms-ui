class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  
  respond_to :html, :xml, :json, :xls

  before_filter :authenticate_user!, :set_current_user
  
  around_filter :scope_current_domain

private

  def set_current_user
    User.current_user = current_user 
    I18n.locale = cookies[:locale] || (current_user && current_user.locale ? User.current_user.locale : 'en-US')
  end

  def current_domain
    @current_domain ||= Domain.find_by_subdomain!(request.subdomain.empty? ? 'system' : request.subdomain)
  end
  helper_method :current_domain
  
  def scope_current_domain(&block)
    Domain.current_domain = current_domain
    yield
  ensure
    Domain.current_domain = nil
  end
end
