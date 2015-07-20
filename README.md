FMS UI
================

This application was generated with the [rails_apps_composer](https://github.com/RailsApps/rails_apps_composer) gem
provided by the [RailsApps Project](http://railsapps.github.io/).

Rails Composer is open source and supported by subscribers. Please join RailsApps to support development of Rails Composer.

Problems? Issues?
-----------

Need help? Ask on Stack Overflow with the tag 'railsapps.'

Your application contains diagnostics in the README file. Please provide a copy of the README file when reporting any issues.

If the application doesn't work as expected, please [report an issue](https://github.com/RailsApps/rails_apps_composer/issues)
and include the diagnostics.

Ruby on Rails
-------------

This application requires:

- Ruby 2.2.0
- Rails 4.2.0

Learn more about [Installing Rails](http://railsapps.github.io/installing-rails.html).

Getting Started
---------------
1. Install gems 
- bundle install

2. Bower install if not installed bower and install client libraries
- npm install -g bower
- rake bower:install

3. Copy database.yml.sample to database.yml and set the database config

4. Start Appllication - Development mode
- rails s

5. Asset compile
- bundle exec rake assets:precompile

6. Start Appllication - Production mode
- bundle exec unicorn -E production -c config/unicorn.rb

Documentation and Support
-------------------------

Issues
-------------

Similar Projects
----------------

Contributing
------------

Credits
-------

License
-------
