Simulator.create!(name: 'Fleet1-Batch1', :type => 'ROUTES', :fleet_id => '1', :url => 'http://127.0.0.1:3000/api/containers/tracks/upload', :fleet_ver => '1.1.1', :gx => 0.56, :gy => -0.32, :gz => 0.81, :simulator_path => '1', :velocity => 87, :kick_counter => 1000, :invoke_cycle => 5)
Simulator.create!(name: 'Fleet1-Batch2', :type => 'ROUTES', :fleet_id => '1', :url => 'http://127.0.0.1:3000/api/containers/tracks/upload', :fleet_ver => '1.1.1', :gx => 0.37, :gy => 0.52, :gz => -0.81, :simulator_path => '2', :velocity => 75, :kick_counter => 2000, :invoke_cycle => 5)