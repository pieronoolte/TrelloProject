Rails.application.routes.draw do
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  root "home#index"

  get "dashboard", to: "dashboard#index"

  resources :boards do
    resources :lists, except: :show
  end


  resources :lists do
    resources :items
  end

  namespace :api do
    resources :boards do 
      resources :lists, only: :index, controller: "lists"
      resources :list_positions, only: [:index, :update], controller: "list_positions"
    end
    # resources :item_positions, only: :update, controller: "item_positions"
    put "item_positions", to: "item_positions#update"
    resources :items, only: :show
  end
end
