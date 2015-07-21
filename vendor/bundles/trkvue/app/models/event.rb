class Event
  
  include Mongoid::Document
  
  store_in collection: "Events"
  
  field :id, type: String
  field :dom, type: String
  field :fid, type: String
  field :fvr, type: String
  field :tid, type: String
  field :bid, type: String
  field :gid, type: String
  field :did, type: String
  field :etm, type: Integer
  field :ctm, type: Integer
  field :typ, type: String
  field :svr, type: String
  field :kct, type: Integer
  field :lat, type: Float
  field :lng, type: Float
  field :gx, type: Float
  field :gy, type: Float
  field :gz, type: Float
	field :vlc, type: Float
	field :dst, type: Float
  field :p_lat, type: Float
  field :p_lng, type: Float
  field :vdo, type: String
  field :f_vdo, type: String
  field :r_vdo, type: String
  field :ado, type: String

  def driver= (driver)
    @driver = driver
  end

  def driver
    @driver = Driver.where(:id => self.did).first unless @driver
    @driver = Driver.new(:id => self.did, :code => self.did, :name => self.did) unless @driver
    @driver
  end
end
