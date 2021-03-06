json.items do |json|
	json.array!(@collection) do |trip|
		json.(trip, :id,:dom,:bid,:fid,:fvr,:did,:dst,:s_lat,:s_lng,:lat,:lng,:stm,:utm,:etm,:sts,:vlc,:a_vlc,:c_off,:c_idl,:c_low,:c_nml,:c_hgh,:c_ovr)

		json.driver trip.driver, :id, :code, :name if trip.driver
	end
end
json.total @total_count
json.success true
