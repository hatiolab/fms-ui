class RemTrace < ActiveRecord::Base

	include Multitenant

	stampable
  
  belongs_to :entity, :polymorphic => true
	
end
