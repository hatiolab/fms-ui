namespace :hatio do
  
  desc "Detect mismatching tags javascript files"
  task :detect_mismatch_tags do
    require 'utils/detect_mismatch_tags'

    unless ENV.include?("tags")
      raise "usage: rake hatio:detect_mismatch_tags tags='{,[,(' dir='vendor/bundles/wms/app/assets/javascripts/bundle/wms'"
    end

    dir, tags = ENV['dir'], ENV['tags']
    puts "dir : #{dir}, tags : #{tags}"
    
    find_mismatches dir, tags
  end
  
  desc "Reset database, tables and data!"
  task :reset => [:environment, 'db:drop', 'db:create', 'db:migrate', 'db:seed']
  
  desc "Create database, tables and load initial data!"
  task :setup => [:environment, :setup_dbconfig, 'db:create', 'db:migrate', 'db:seed']

  desc "Seed"
  task :seed => [:environment, 'db:seed']
    
  desc "Migrate db and data"
  task :migrate => [:environment, 'db:migrate', 'db:seed']
  
  desc "Load Seed - rake hatio:load_seed[bundle, src_file_name]"
  
  task :load_seed, [:bundle, :src_file_name] => :environment do |t, args|
    src_file_name = args.src_file_name
    bundle = args.bundle
    
    Domain.current_domain = Domain.find_by(name: ENV['domain'] || 'System')
    User.current_user = User.find_by(name: ENV['user'] || 'admin')
    
    puts "Start to load #{bundle}, #{src_file_name} file ...."
    load "#{Rails.root}/vendor/bundles/#{bundle}/db/seeds/#{src_file_name}"
    puts "Completed to load seed!"
  end
  
  desc "Upload locale files to Database"
  task :upload_locale => :environment do
    require 'utils/upload_locale'

    Domain.current_domain = Domain.find_by(name: ENV['domain'] || 'System')
    User.current_user = User.find_by(name: ENV['user'] || 'admin')
    
    upload_locale(nil)
  end
  
  desc "Upload locale files of bundle to Database - rake hatio:upload_bundle_locale[bundle]"
  task :upload_bundle_locale, [:bundle] => :environment do |t, args|
    bundle = args.bundle
    require 'utils/upload_locale'
    
    Domain.current_domain = Domain.find_by(name: ENV['domain'] || 'System')
    User.current_user = User.find_by(name: ENV['user'] || 'admin')
    puts "bundle : #{bundle}"
    
    upload_locale(bundle)
  end
  
  desc "Create domain data to Database"
  task :create_domain => :environment do

    if ENV['domain'].nil?
      raise "usage: rake hatio:create_domain domain={domain name}"
    end
    
    Rake::Task["db:seed"].invoke
  end
  
end
