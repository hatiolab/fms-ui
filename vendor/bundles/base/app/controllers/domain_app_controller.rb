class DomainAppController < InheritedResources::Base

  include Basic

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception

  #respond_to :html, :xml, :json, :xls
  respond_to :html, :xml, :json

  before_filter :authenticate_user!, :set_current_user
  
  around_filter :scope_current_domain

end