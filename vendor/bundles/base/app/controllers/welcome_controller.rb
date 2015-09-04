class WelcomeController < ApplicationController
  
  #layout false
  
  def index
    if(user_signed_in?)
      render :layout => true
    else
      redirect_to new_user_session_path
    end
  end
  
  def std
    if current_user.operator_flag
      redirect_to :action => 'ops'
    else
      render :layout => false
    end
  end

end
