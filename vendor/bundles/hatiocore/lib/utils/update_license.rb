def update_license
  Dir[Rails.root.to_path + '/app/assets/javascripts/**/*.js'].each do |jsfile|
    puts "[JS FILE] #{jsfile}"
  end
end