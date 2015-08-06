json.(@driver, :id,:domain_id,:code,:name,:social_id,:email,:title,:division,:phone_no,:mobile_no,:address,:creator_id,:updater_id,:created_at,:updated_at)

json.img @driver.img ? @driver.img.url : ''