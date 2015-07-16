class CommonCode < ActiveRecord::Base
  
  include Multitenant
  
  stampable
  strip_cols [:name]
  removing_trackable

  belongs_to :parent, :class_name => "CommonCode", :foreign_key => "parent_id"
  
  validates_presence_of :name, :strict => true
  validates :name, length: { maximum: 60 }, :strict => true
  validates :description, length: { maximum: 255 }, :strict => true
  validates_uniqueness_of :name, :strict => true, :scope => [:domain_id, :parent_id]
  
  after_destroy do
    # 삭제할 코드가 Parent이면 Children을 모두 삭제한다.
    self.codes.each { |code| code.destroy! } unless(self.parent)
  end
  
  def codes
    return (self.parent_id && !self.parent_id) ? nil : CommonCode.where(parent_id: self.id).order("name asc")
  end
  
  def self.find_code(code_master_name, code_value)
    code_master = CommonCode.find_by_name(code_master_name)
    return nil unless(code_master)
    return code_master.codes.find { |c| c.name == code_value }
  end

  # setup helper
  class SetupHelper
    attr_accessor :codes

    def initialize
      @codes = []
    end

    def code(codes={})
      @codes << codes
    end
  end

  def self.setup(name, options={}, &block)
    common_code = CommonCode.find_by_name(name) || CommonCode.create(options.merge(:name => name.to_s))

    setup_helper = SetupHelper.new
    setup_helper.instance_eval &block if block_given?

    setup_helper.codes.each do |code|
      code.each do |key, value|
        #value, description = value if value.is_a? Array
        CommonCode.create({:name => key.to_s, :description => value.to_s, :parent_id => common_code.id})
      end
    end

    common_code.save
    common_code
  end
  
end
