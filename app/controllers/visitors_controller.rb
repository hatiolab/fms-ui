class VisitorsController < ApplicationController
	def index
		if(user_signed_in?)
			redirect_to :controller => 'welcome', :action => 'index'
		else
			render :layout => true
		end
	end
end
