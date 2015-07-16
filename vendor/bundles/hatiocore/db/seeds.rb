Dir[File.join(File.dirname(__FILE__), 'seeds', '*.rb')].sort.each do |seed|
  puts "Seeding Base ... #{seed}"
  load seed
end
