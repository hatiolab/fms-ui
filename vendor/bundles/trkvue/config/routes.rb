Trkvue::Engine.routes.draw do
  
  # RESOURCES BEGIN BLOCK DON'T REMOVE
	resources :simulators do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
	end

	resources :simulator_paths do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
	end

	resources :movies do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
	end

	resources :batches do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
	end

	resources :geofence_groups do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
	end

	resources :drivers do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
		member do
			post :upload_image
		end
	end

	resources :settings do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
	end

	resources :polygons do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
	end

	resources :geofences do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
    member do
      post :update_multiple_polygons
    end
	end

	resources :fleet_groups do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
	end

	resources :fleets do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
		member do
			get :trip
		end
	end

	resources :trips do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
		member do
			get :trip_set
			get :prev_trip
			get :next_trip
		end
	end
  
	resources :events do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
		member do
			get :latest_one
			get :prev_event
			get :next_event
		end
	end
  
	resources :tracks do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
	end
end
