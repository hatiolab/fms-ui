#encoding: utf-8 

Menu.setup :Trackvue, {:rank => 8000} do
	submenu :Watcher, {:rank => 8050, :template => 'Trkvue.view.watcher.Watcher'}
  submenu :Setting, {:rank => 8100, :template => 'Trkvue.view.setting.Setting'}
  submenu :Driver, {:rank => 8200, :template => 'Trkvue.view.driver.Driver'}
  submenu :FleetGroup, {:rank => 8300, :template => 'Trkvue.view.fleet_group.FleetGroup'}
  submenu :Geofence, {:rank => 8400, :template => 'Trkvue.view.geofence.Geofence'}
  submenu :Fleet, {:rank => 8500, :template => 'Trkvue.view.fleet.Fleet'}
  submenu :Trip, {:rank => 8600, :template => 'Trkvue.view.trip.Trip'}
  submenu :Batch, {:rank => 8700, :template => 'Trkvue.view.batch.Batch'}
  submenu :Track, {:rank => 8800, :template => 'Trkvue.view.track.Track'}
  submenu :Event, {:rank => 8900, :template => 'Trkvue.view.event.Event'}
  submenu :SimulatorPath, {:rank => 8920, :template => 'Trkvue.view.simulator_path.SimulatorPath'}
  submenu :Simulator, {:rank => 8930, :template => 'Trkvue.view.simulator.Simulator'}
end
