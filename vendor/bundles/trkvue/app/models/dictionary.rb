class Dictionary < ActiveRecord::Base

	include Multitenant

	strip_cols [:name]

	stampable

	validates_presence_of :name,:locale,:category, :strict => true

	validates :name, length: { maximum: 255 }, :strict => true

	validates :description, length: { maximum: 1000 }, :strict => true

	validates :locale, length: { maximum: 10 }, :strict => true

	validates :category, length: { maximum: 20 }, :strict => true

	validates :display, length: { maximum: 1000 }, :strict => true

  validates_uniqueness_of :name, :strict => true, :scope => [:domain_id, :locale, :category]

  before_save :expire_dictionary_cache
  
  before_destroy :expire_dictionary_cache
  
  def self.to_resource locale
    @@dictionary_json ||= {}
    @@dictionary_json["#{Domain.current_domain.id}:#{locale}"] ||= begin
      terms = select([:category, :name, :display]).where(locale: locale).order(:category, :name)
      terms.group_by(&:category).reduce({}) do |resource, (category, terms)|
        resource[category] = terms.reduce({}) do |cat, term|
          cat[term.name] = term.display unless term.display.blank?
          cat
        end
        resource
      end.to_json
    end
  end
  
  def self.t category, name
    t = where(locale: I18n.locale, category: category, name: name).first
    t ? t.display : "#{category}.#{name}"
  end

private
  
  def expire_dictionary_cache
    @@dictionary_json["#{self.domain_id}:#{self.locale}"] = nil if defined? @@dictionary_json
  end

end