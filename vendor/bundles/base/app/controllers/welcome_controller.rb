class WelcomeController < ApplicationController
  
  layout false
  
  def index
    if current_user.operator_flag
      redirect_to :action => 'ops'
    else
      redirect_to :action => 'std'
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
