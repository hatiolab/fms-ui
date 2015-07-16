class Entity < ActiveRecord::Base
  
  include Multitenant

  stampable
  strip_cols [:name]
  removing_trackable

  has_many :entity_columns, -> { order('disp_rank asc') }, :dependent => :destroy
  has_many :entity_properties, :dependent => :destroy
  has_many :entity_logics, -> { order('name asc') }, :dependent => :destroy

  belongs_to :list_infographic, class_name: 'Infographic'
  belongs_to :item_infographic, class_name: 'Infographic'
  
  validates_presence_of :name, :strict => true
  validates :name, length: { maximum: 60 }, :strict => true
  validates :description, length: { maximum: 255 }, :strict => true
  validates_uniqueness_of :name, :strict => true, :scope => :domain_id

  #
  # create entity columns for loaded resource's columns
  #
  def create_entity_columns
    entity = self.name.constantize
    entity.reset_column_information
    
    entity.columns.each_with_index do |column, i|
      f = self.entity_columns.detect{ |col| col.name == column.name }
      unless f
        f = self.entity_columns.build(:name => column.name)
        association = entity.reflect_on_all_associations(:belongs_to).detect{|a| a.options[:foreign_key] == column.name }
        association ||= entity.reflect_on_association column.name.sub(/_id$/, '').to_sym if column.name.ends_with? '_id'
        if association
          f.ref_type = :Entity.to_s
          f.ref_name = association.options[:polymorphic] ? 'POLYMORPHIC' : association.class_name
        end
      end
      
      f.term = "label.#{column.name}" unless f.term
      f.col_type = column.type.to_s
      f.col_size = column.limit if(column.respond_to?(:limit))
      f.nullable = column.null
      f.def_val = (column.default == nil) ? nil : column.default.to_s
      f.disp_rank = i * 10
      f.save!
    end

    uniq_index_def = ActiveRecord::Base.connection.indexes(entity.table_name).find { |index_def| index_def.unique == true }
    
    # unique ranks by getting unique index
    if(uniq_index_def)
      uniq_seq = 1
      uniq_index_def.columns.each do |uniq_col_name|
        column = self.entity_columns.where("name = ?", uniq_col_name).first
        if(column)
          column.uniq_rank = uniq_seq * 10
          column.save!
          uniq_seq += 1
        end
      end
    end
    
    return self.entity_columns
  end
  
  #
  # select all entity columns for search resources
  #  
  def columns_for_search
    self.entity_columns.select("name, ref_type, ref_name, col_type")
  end
  
  #
  # select all entity columns which list_rank value greater than 0
  #
  def list_columns
    self.entity_columns.where("list_rank > 0").order("list_rank asc")
  end
  
  #
  # select all entity columns which list_rank value greater than 0 except this columns : 'domain_id', 'creator_id', 'updater_id', 'created_at', 'updated_at'
  #
  def export_columns
    self.entity_columns.select("name, description, ref_type, ref_name, col_type").where("list_rank > 0 and name not in ('domain_id', 'creator_id', 'updater_id', 'created_at', 'updated_at')").order("list_rank asc")
  end
  
  def self.setup(entity_class, options = {}, &block)
    entity = Entity.find_by_name(entity_class.to_s)
    entity ||= Entity.create(options.merge({:name => entity_class.to_s}))

    setup_helper = SetupHelper.new(entity)
    setup_helper.instance_eval &block if block_given?
    setup_helper.ending
    ent_cols = entity.create_entity_columns
    
    setup_helper.columns.each do |c|
      column = ent_cols.detect{ |ec| ec.name == c[:name].to_s }
      next unless column
      
      c.each do |key, value|
        case key
        when :list_rank
          column.list_rank = value
        when :code
          column.ref_type = :CommonCode.to_s
          column.ref_name = value.to_s
        when :resource
          column.ref_type = :Entity.to_s
          column.ref_name = value.to_s
        end
      end

      # set column description
      if(column.list_rank > 0 && !['id', 'creator_id', 'updater_id', 'created_at', 'updated_at'].include?(column.name))
        t = Terminology.where("name = ? and category = ? and locale = ?", column.name, "label", "en-US").first
        if(t)
          column.description = t.display
        else
          desc = column.name
          desc = desc.split('_id')[0] if(desc.ends_with?('_id'))
          column.description = desc.camelize
        end
      end
      
      column.save
    end
    
    setup_helper.properties.each do |p|
      EntityProperty.create(p.merge({
        entity: entity
      }))
    end

    entity.save
    entity
  end
  
  # setup helper
  class SetupHelper
    attr_accessor :list_columns, :columns, :properties

    def initialize(entity)
      @entity = entity
      @columns = []
      @list_columns = []
      @properties = []
    end

    def ending
      if @list_columns && !@list_columns.empty?
        @entity.list_columns.each { |h| h.list_rank = 0 }
        @list_columns.each_with_index do |column, i|
          @columns << {:name => column, :list_rank => ((i + 1) * 10)}
        end
      end
    end

    def column(column_name, options={})
      @columns << options.merge({:name => column_name})
    end
    
    def property(property_name, options={})
      @properties << options.merge({:name => property_name})
    end
  end
end
