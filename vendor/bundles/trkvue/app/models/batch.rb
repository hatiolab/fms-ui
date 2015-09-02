class Batch

  include Mongoid::Document
  
  store_in collection: "Batches"

  field :id, type: String
  field :tid, type: String
  field :vlc, type: Float
  field :a_vlc, type: Float
  field :sts, type: String
  field :dst, type: Float
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
  field :stm, type: Integer
  field :etm, type: Integer
  field :utm, type: Integer

end
