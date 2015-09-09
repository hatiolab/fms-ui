class User < ActiveRecord::Base
  
  stampable
  
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  belongs_to :domain
  # Setup accessible (or protected) attributes for your model
  # attr_accessible :login, :name, :email, :password, :password_confirmation, :remember_me
  
  before_create do
    self.login = self.email if(!self.login)
    self.locale = 'en-US' if(!self.locale)
    self.active_flag = true if(!self.active_flag)
  end

  def self.get_user(userId)
    User.find(userId)
  end

  def my_domain
    self.domain ? self.domain : Domain.system_domain
  end

  class << self
    def current_user=(user)
      Thread.current[:current_user] = user
    end

    def current_user
      Thread.current[:current_user]
    end
  end
end
