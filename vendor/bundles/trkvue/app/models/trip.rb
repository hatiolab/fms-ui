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
end
