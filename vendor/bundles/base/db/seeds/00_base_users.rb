#encoding: utf-8 

User.current_user = User.where(login: 'admin').first_or_create(
  name: 'Admin', 
  email: 'admin@example.com', 
  password: 'admin', 
  password_confirmation: 'admin',
  admin_flag: true,
  timezone: 'Beijing', 
  locale: 'en-US'
)
