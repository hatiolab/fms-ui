class Trip

  include Mongoid::Document
  
  store_in collection: "Trips"

  field :id, type: String
  field :dom, type: String
  field :bid, type: String
  field :fid, type: String
  field :fvr, type: String
  field :tid, type: String
  field :did, type: String
  field :stm, type: Integer
  field :etm, type: Integer
  field :utm, type: Integer
  field :sts, type: String
  field :s_lat, type: Float
  field :s_lng, type: Float
  field :lat, type: Float
  field :lng, type: Float
  field :c_off, type: Integer
  field :c_idl, type: Integer
  field :c_low, type: Integer
  field :c_nml, type: Integer
  field :c_hgh, type: Integer
  field :c_ovr, type: Integer
  field :vlc, type: Float
  field :a_vlc, type: Float

  def driver= (driver)
    @driver = driver
  end

  def driver
    @driver = Driver.where(:id => self.did).first unless @driver
    @driver = Driver.new(:id => self.did, :code => self.did, :name => self.did) unless @driver
    @driver
  end
  
  before_destroy do |document|
    tracks = Track.all_of({"tid" => self.id})
    tracks.each do |track| 
      # debug_print "track : #{track.id}"
      track.destroy
    end

    events = Event.all_of({"tid" => self.id})
    events.each do |event| 
      # debug_print "event : #{event.id}"
      event.destroy
    end

    batches = Batch.all_of({"tid" => self.id})
    batches.each do |batch| 
      # debug_print "batch : #{batch.id}"
      batch.destroy
    end
  end  
end