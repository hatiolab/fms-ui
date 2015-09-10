ActionMailer::Base.smtp_settings = {
 :address              => "smtp.gmail.com",
 :port                 => "587",
 :domain               => "gmail.com",
 :user_name            => "shortstop@hatiolab.com",
 :password             => "",
 :authentication       => "plain",
 :enable_starttls_auto => true
}

ActionMailer::Base.raise_delivery_errors = true
ActionMailer::Base.default_url_options[:host] = "192.168.35.153:8000"