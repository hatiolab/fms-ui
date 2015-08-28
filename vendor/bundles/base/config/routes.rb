Base::Engine.routes.draw do
  # RESOURCES BEGIN BLOCK DON'T REMOVE
	resources :code_expansions do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
	end

	resources :expansion_codes do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
    member do
      post :update_multiple_items
    end
	end

	resources :error_logs do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
	end

	resources :chits do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
    member do
      post :print
    end
	end

  devise_for :users, controllers: { sessions: "sessions" }
  
  devise_scope :user do
    post "create", :to => "users"
    post "destroy_multiple", :to => "users"
    get "login", to: "sessions#new"
    get "logout", to: "sessions#destroy"
  end
  
  match '(errors)/:status', to: 'errors#show', constraints: {status: /\d{3}/}, via: :all
  
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"

  resources :users, :only => [:show, :index, :edit, :update]  
  
  resources :domains do
    member do
      post :enter
    end
    
    collection do
      get :change
      post :update_multiple
    end
  end

	resources :contacts do
		collection do
			post :update_multiple
      get :show_by_name
      post :import
      post :export_screen
		end
	end

	resources :reports do
		collection do
			post :update_multiple
      get :show_by_name
		end
	end

	resources :properties do
		collection do
			post :update_multiple
      get :show_by_name
		end
	end

  resources :infographics do
		collection do
			post :update_multiple
      get :show_by_name
      get :show_by_entity
		end
  end
  
  resources :variables do
		collection do
			post :update_multiple
      get :show_by_name
      post :import
      get :export
		end
  end
  
  resources :terminologies do
		collection do
			post :update_multiple
      get :locale_resource
      post :import
      get :export
      put :upsert
		end
  end
  
  resources :common_codes do
    collection do
      post :update_multiple
      get :show_by_name
    end
    member do
      post :update_multiple_codes
    end
  end

  resources :entities do
    collection do
      post :update_multiple
      post :generate_table
      get :show_by_name
      post :import
      get :export
    end
    member do 
      get :entity_columns
      get :entity_props
      get :entity_logics
      post :create_entity_columns
      post :update_multiple_entity_columns
      post :update_multiple_entity_props
      post :update_multiple_entity_logics
      post :generate
    end
  end
  
  resources :menus do
    collection do
      post :update_multiple
      post :update_multiple_submenus
      get :show_by_name
    end
    member do
      get :menu_params
      post :update_multiple_menu_params
    end
  end

  resources :roles do
    collection do
      post :update_multiple
      get :show_by_name
    end
    member do
      get :role_users
      get :permitted_resources
      post :update_permissions
      post :update_users
    end
  end

	resources :attachments do
		collection do
			post :update_multiple
			get :show_by_name
		end
    member do
      get :download
    end
	end

	resources :calendar_dates do
		collection do
			post :update_multiple
		end
	end
	    
	resources :calendars do
		collection do
			post :update_multiple
			get :show_by_name
		end
		member do
		  get :calendar_dates
	  end
	end

  resources :diy_reports do
    collection do
      post :update_multiple
      get :show_by_name
      post :import
      get :export
    end
    member do 
      post :update_multiple_parameters
      post :generate_views
    end
  end
  
  resources :diy_selections do
    collection do
      post :update_multiple
      get :show_by_name
      post :import
      get :export
      get :export_screen
    end
    member do
      post :update_multiple_parameters
      post :shoot
      get :query
      post :export_screen
    end
  end

  resources :diy_services do
    collection do
      post :update_multiple
      get :show_by_name
      post :import
      get :export
    end
    member do 
      post :update_multiple_parameters
      post :shoot
      get :query
    end
  end

	resources :shifts do
    member do
      get :current_work_date
    end
    collection do
      get :to_events
    end
  end
  
	resources :rem_traces do
		collection do
			post :update_multiple
			get :show_by_name
			get :export
		end
	end  

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
