json.(@driver, :id,:domain_id,:code,:name,:social_id,:email,:title,:division,:phone_no,:mobile_no,:address,:point,:created_at,:updated_at)

json.img @driver.img ? @driver.img.url : ''
json.creator @driver.creator, :id, :name if @driver.creator
json.updater @driver.updater, :id, :name if @driver.updater