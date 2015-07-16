# This migration comes from trkvue_engine (originally 20150619082212)
class CreatePolygons < ActiveRecord::Migration

	def change
		create_table :polygons  do |t|
			t.references :geofence
			t.float :lat, :null => false
			t.float :lng, :null => false
		end

		add_index :polygons, [:geofence_id], :name => :ix_polygons_0
	end

end
