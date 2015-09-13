class Domain < ActiveRecord::Base
  
  stampable
  has_one :shift
  validates_presence_of :name
  validates_uniqueness_of :name, :case_sensitive => false

  mount_uploader :brand_image, FileUploader
  mount_uploader :content_image, FileUploader

  #
  # Before Save
  #
  before_create do
    if(self.system_flag)
      raise "System Domain already exist!" if Domain.system_domain
    end
  end

  #
  # After Create
  #
  after_create do
    self.setup
  end

  #
  # Find System Domain. System Domain must be only one
  #
  def self.system_domain
    Domain.find_by_system_flag(true)
  end

  #
  # Generate initial data - settings, common codes, 
  #
  def setup
    # Settings, common_codes, entities, menus, terminologies
    return if self.exist_initial_data
    debug_print "Progressing setup initial data ..."
    sys_dom = Domain.system_domain

    debug_print "Finding initial data from System Domain ..."
    ori_codes = CommonCode.where("domain_id = #{sys_dom.id} and parent_id is null")
    ori_entities = Entity.where("domain_id = #{sys_dom.id}")
    ori_settings = Setting.where("domain_id = #{sys_dom.id}")

    debug_print "Copying initial data to Domain (#{self.name})..."
    self.clone_code_to_domain(ori_codes)
    self.clone_entity_to_domain(ori_entities)
    self.clone_to_domain(ori_settings, Setting)

    debug_print "Completed setup initial data ..."
  end

  #
  # Clone common code to domain 
  #
  def clone_entity_to_domain(entities)
    entities.each do |entity|
      hash = entity.attributes
      hash[:id] = nil
      hash[:domain_id] = self.id
      entity = Entity.create!(hash)
      entity.create_entity_columns
    end
  end

  #
  # Clone common code to domain 
  #
  def clone_code_to_domain(codes)
    codes.each do |code|
      subcodes = code.codes
      hash = code.attributes
      hash[:id] = nil
      hash[:domain_id] = self.id
      new_code = CommonCode.create!(hash)

      subcodes.each do |subcode|
        sub_hash = subcode.attributes
        sub_hash[:id] = nil
        sub_hash[:domain_id] = self.id
        sub_hash[:parent_id] = new_code.id
        CommonCode.create!(sub_hash)
      end
    end
  end

  #
  # Clone object and save
  #
  def clone_to_domain(objs, resource)
    objs.each do |obj|
      hash = obj.attributes
      hash[:id] = nil
      hash[:domain_id] = self.id
      resource.create!(hash)
    end
  end

  #
  # Check if this domain initial data can be generated
  #
  def exist_initial_data
    return Setting.where("domain_id = #{self.id}").count > 1
  end

  #
  # Pluggable model dynamic loading
  #
  Hatio::PluggableSpot::DOMAIN_MODEL_PLUGGABLES.each do |pluggable_code|
    self.class_eval &pluggable_code
  end
  
  class << self
    def current_domain=(domain)
      Thread.current[:current_domain] = domain
    end

    def current_domain
      Thread.current[:current_domain] ? Thread.current[:current_domain] : Domain.system_domain
    end
  end  
end
