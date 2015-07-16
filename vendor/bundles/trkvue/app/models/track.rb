class Track

  include Mongoid::Document
  
  store_in collection: "Tracks"

  field :id, type: String
  field :dom, type: String
  field :fid, type: String
  field :fvr, type: String
  field :tid, type: String
  field :bid, type: String
  field :did, type: String
  field :kct, type: Integer
  field :p_lat, type: Float
  field :p_lng, type: Float
  field :lat, type: Float
  field :lng, type: Float
	field :vlc, type: Float
	field :a_vlc, type: Float
	field :dst, type: Float
  field :gx, type: Float
  field :gy, type: Float
  field :gz, type: Float
  field :f_img, type: String
  field :r_img, type: String
  field :stm, type: String
  field :ttm, type: String
  field :ctm, type: String
  
end
