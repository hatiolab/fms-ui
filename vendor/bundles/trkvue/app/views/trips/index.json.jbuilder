json.items do |json|
	json.array!(@collection) do |trip|
		json.(trip, :id,:dom,:bid,:fid,:fvr,:did,:s_lat,:s_lng,:lat,:lng,:stm,:utm,:etm,:sts,:c_off,:c_idl,:c_low,:c_nml,:c_hgh,:c_ovr)
	end
end
json.total @total_count
json.success true
