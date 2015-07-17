class WelcomeController < ApplicationController
  
  #layout false
  
  def index
    render :layout => true
  end
  
  def std
    if current_user.operator_flag
      redirect_to :action => 'ops'
    else
      render :layout => false
    end
  end

end
