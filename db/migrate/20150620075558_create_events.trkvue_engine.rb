# This migration comes from trkvue_engine (originally 20150608181433)
class CreateEvents < ActiveRecord::Migration

  def change
    create_table :events do |t|
      t.string :dom, :null => false, :limit => 16
      t.string :fid, :null => false, :limit => 32
      t.string :fvr, :null => false, :limit => 16
      t.string :did, :null => false, :limit => 32
      t.string :tid, :null => false, :limit => 32
      t.string :bid, :null => false, :limit => 32
      t.string :gid, :null => false, :limit => 32
      t.integer :otm, :null => false
      t.integer :ctm, :null => false
      t.integer :kct
      t.string :typ
      t.float :vlc
      t.string :svr
      t.float :lat, :null => false
      t.float :lng, :null => false
      t.float :gx, :null => false
      t.float :gy, :null => false
      t.float :gz, :null => false
      t.string :vdo, :limit => 255
      t.string :f_vdo, :limit => 255
      t.string :r_vdo, :limit => 255
      t.string :ado, :limit => 255
    end

    add_index :events, [:id], :unique => true, :name => :ix_event_0
  end

end
