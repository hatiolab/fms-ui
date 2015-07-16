module Hatio
  module Generators
    class BundleGenerator < Rails::Generators::NamedBase
  
      source_root File.expand_path('../templates', __FILE__)
      class_option :bundle_name, :type => :string, :default => '', :desc => "bundle name you want to generate"
      APP_BUNDLE_PATH = File.join(Rails.root, "/vendor/bundles")
  
      def generate_bundle
    
        begin
          raise "Bundle name is empty!" unless(class_name)
          @bundle_name = "#{class_name.downcase}"
          puts "Generate #{@bundle_name} server bundle...."
      
          # CREATE SERVER BUNDLE
          empty_directory "#{APP_BUNDLE_PATH}"
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}"
      
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app"
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/controllers"
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/models"
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/helpers"
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/views"
      
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/config"
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/config/locales"
      
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/db"
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/db/migrate"
          template "seeds.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/db/seeds.rb"
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/db/seeds"
          template "04_seed_entities.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/db/seeds/04_#{@bundle_name}_entities.rb"
          template "05_seed_common_codes.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/db/seeds/05_#{@bundle_name}_common_codes.rb"
          template "06_seed_menus.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/db/seeds/06_#{@bundle_name}_menus.rb"
      
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/lib"
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/lib/#{@bundle_name}"
      
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/test"
              
          template "init.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/lib/init.rb"
          template "lib_bundle.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/lib/#{@bundle_name}.rb"
          template "version.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/lib/#{@bundle_name}/version.rb"
          template "engine.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/lib/#{@bundle_name}/engine.rb"
          template "pluggable_spot.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/lib/#{@bundle_name}/pluggable_spot.rb"
      
          template "routes.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/config/routes.rb"

          ['en-US', 'ko-KR', 'zh-CN'].each do |locale|
            @locale = locale
            template "locales.yml", "#{APP_BUNDLE_PATH}/#{@bundle_name}/config/locales/#{locale}.yml"
          end

          template "task.rake", "#{APP_BUNDLE_PATH}/#{@bundle_name}/lib/tasks/#{@bundle_name}.rake"
          template "Gemfile", "#{APP_BUNDLE_PATH}/#{@bundle_name}/Gemfile"
          template "Rakefile", "#{APP_BUNDLE_PATH}/#{@bundle_name}/Rakefile"
          template "gemspec", "#{APP_BUNDLE_PATH}/#{@bundle_name}/#{@bundle_name}.gemspec"
          template "LICENSE.txt", "#{APP_BUNDLE_PATH}/#{@bundle_name}/LICENSE.txt"
          template "README.md", "#{APP_BUNDLE_PATH}/#{@bundle_name}/README.md"
      
          template "test_helper.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/test/test_helper.rb"
          template "test.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/test/#{@bundle_name}_test.rb"

          puts "Server bundle #{@bundle_name} generated!"

          puts "Generate #{@bundle_name} client bundle...."

          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/assets"
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/assets/images"
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/assets/javascripts"
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/assets/javascripts/bundle"
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/assets/javascripts/bundle/#{@bundle_name}"
      
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/assets/javascripts/bundle/#{@bundle_name}/controller"
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/assets/javascripts/bundle/#{@bundle_name}/model"
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/assets/javascripts/bundle/#{@bundle_name}/store"
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/assets/javascripts/bundle/#{@bundle_name}/view"
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/assets/javascripts/bundle/#{@bundle_name}/mixin"
          empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/assets/javascripts/bundle/#{@bundle_name}/locale"
      
          ['en-US', 'ko-KR', 'zh-CN'].each do |locale|
            template "locale.js", "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/assets/javascripts/bundle/#{@bundle_name}/locale/#{locale}.js"
          end

          template "Controller.js", "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/assets/javascripts/bundle/#{@bundle_name}/controller/#{class_name}Controller.js"
          template "index.js", "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/assets/javascripts/bundle/#{@bundle_name}/index.js"
          
          puts "Client bundle #{@bundle_name} generated!"
      
          puts "Success"
        rescue StandardError => e
          puts "\nError : #{e}"
        end
      end
  
    end
  end # end of Generator module
end # end of Hatio module