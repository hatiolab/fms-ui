Rails.application.routes.draw do

  root to: 'visitors#index'
  
  devise_for :users
  
  resources :users
  
  get "trkvue" => "welcome#index"
    
  Hatio::Bundle.ordered_bundle_list.each do |bundle|
    mount bundle.module::Engine => "/"
  end

end
