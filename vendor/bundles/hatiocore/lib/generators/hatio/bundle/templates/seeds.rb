Dir[File.join(File.dirname(__FILE__), 'seeds', '*.rb')].sort.each do |seed|
  puts "Seeding <%= class_name %> ... #{seed}"
  load seed
end
