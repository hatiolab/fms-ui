class Menu < ActiveRecord::Base

  include Multitenant
    
  stampable
  strip_cols [:name]
  removing_trackable

  belongs_to :parent, :class_name => "Menu", :foreign_key => "parent_id"
  
  validates_presence_of :name, :strict => true
  validates :name, length: { maximum: 60 }, :strict => true
  validates :description, length: { maximum: 255 }, :strict => true
  validates_presence_of :menu_type, :strict => true
  validates_presence_of :category, :strict => true
  validates_uniqueness_of :name, :strict => true, :scope => [:domain_id, :parent_id]
  
  has_many :menu_params, -> { order('name asc') }, :dependent => :destroy

  attr_accessor :auth

  # TODO 일단 하드 코딩 --> 추후 권한 데이터를 넘겨줌 
  def auth
    ""
  end
  
  # setup helper
  class SetupHelper
    attr_accessor :submenus
     
    def initialize
      @submenus = []
    end
    
    def submenu(name, options={}, &block)
      options[:name] = name.to_s
      options[:menu_type] ||= 'SCREEN' unless block_given?
      @submenus << options
    end
  end
  
  def self.setup(name, options={}, &block)
    menu = Menu.find_by_name(name.to_s)
    menu ||= Menu.create name: name.to_s, rank: options[:rank] || 100, menu_type: 'MENU', category: options[:category] || 'STANDARD'
    
    setup_helper = SetupHelper.new
    setup_helper.instance_eval &block if block_given?
    
    setup_helper.submenus.each_with_index do |submenu, i|
      Menu.create({
        :name => submenu[:name], 
        :template => submenu[:template],
        :parent => menu,
        :menu_type => submenu[:menu_type],
        :category => submenu[:category] || 'STANDARD',
        :rank => submenu[:rank] || i * 10,
        :menu_type => submenu[:menu_type]
      })
    end

    menu
  end
end
