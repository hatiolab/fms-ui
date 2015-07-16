class Batch

  include Mongoid::Document
  
  store_in collection: "Batches"

  field :id, type: String
  field :tid, type: String
  field :vlc, type: String
  field :a_vlc, type: String
  field :sts, type: String
  field :dst, type: String
  field :s_lat, type: String
  field :s_lng, type: String
  field :lat, type: String
  field :lng, type: String
  field :c_off, type: Float
  field :c_idl, type: Float
  field :c_low, type: Float
  field :c_nml, type: Float
  field :c_hgh, type: Integer
  field :c_ovr, type: Integer
  field :stm, type: Integer
  field :etm, type: Integer
  field :utm, type: Integer

end
