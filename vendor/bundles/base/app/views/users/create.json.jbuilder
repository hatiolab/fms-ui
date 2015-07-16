json.(@user, :id, :login, :name, :email, :admin_flag, :locale, :timezone, :password, :operator_flag, :active_flag)

json.updated_at @user.updated_at
# json.updater @user.updater, :id, :name if @user.updater

json.created_at @user.created_at
# json.creator @user.creator, :id, :name if @user.creator
