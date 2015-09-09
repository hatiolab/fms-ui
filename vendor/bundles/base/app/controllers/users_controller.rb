class UsersController < ApplicationController
  
  before_filter :authenticate_user!
  skip_before_filter :verify_authenticity_token
  respond_to :html, :xml, :json, :xls

private

  def resource_params
    [ params.require(:user).permit(:login, :name, :email, :password, :password_confirmation, :locale, :timezone, :admin_flag, :active_flag, :operator_flag, :domain_id) ]
  end
    
public
  
  def create
    @user = User.new(resource_params[0])
    @user.save!
  end
  
  def index
    conditions, include_arr, order_str, limit, offset = search_filter User
    # TODO domain_id를 integer 형으로 변경 필요 
    if(params["_q"]["domain_id-eq"])
      param_domain_id = params["_q"]["domain_id-eq"]
      conditions[0] << " and users.domain_id = '#{param_domain_id}'"
    end
    @total_count = User.where(conditions).count
    @users = User.where(conditions).order(order_str).limit(limit).offset(offset)
  end

  def show
    @user = User.find(params[:id])
  end

  # GET /users/edit/1
  def edit
    @user = User.find(params[:id])
  end
  
  # PUT /users/1
  def update
    user_param = resource_params[0]
    @user = User.find(params[:id])
    
    # Password 변경 ...
    unless(user_param[:password].blank?)
      raise "Password and password confirmation value must match!" if(user_param[:password] != user_param[:password_confirmation])
    else
      user_param.delete(:password)
      user_param.delete(:password_confirmation)
    end
    
    respond_to do |format|
      if @user.update_attributes(user_param)
        format.json { render :json => @user }
        format.xml  { render :xml => @user }
      else
        format.json { render json: @user.errors, status: :unprocessable_entity }
        format.xml  { render :xml => @user }
      end
    end
  end

  def exists
    user = User.find_by_email(params[:email])
    respond_to do |format|
      format.xml  { render :xml => user }
      format.json { render :json => user }
    end    
  end
  
  def destroy
    @user = User.find(params[:id])
    @user.destroy
    
    respond_to do |format|
      format.xml  { render :xml => @user }
      format.json { render :json => @user }
    end
  end
  
  def destroy_multiple
    id_list = JSON.parse(params[:ids])
    users = User.find(id_list)
    users.each { |user| user.destroy }
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => 'Success'} }
      format.json { render :json => {:success => true, :msg => 'Success'} }
    end
  end
  
end
