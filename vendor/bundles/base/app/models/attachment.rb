class Attachment < ActiveRecord::Base
  include Multitenant
    
  stampable

  mount_uploader :path, FileUploader
    
  belongs_to :on, polymorphic: true
  
  before_create :update_asset_attributes
  
  def update_asset_attributes
    basename = File.basename(path.filename, '.*') if path
    extname = File.extname(path.filename) if path
    self.name ||=  basename + extname if path
    self.mimetype ||= Mime::Type.lookup_by_extension(extname.sub('.', '')).to_s if path
    self.file_size ||= path.file.size if path
  end

  attr_accessor :url

end
