Trkvue::Engine.routes.draw do
  
  get "#{GlobalConfig.ops_name}" => "controltower#index"
  
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
	end

	resources :trips do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
	end
  
	resources :events do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
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
