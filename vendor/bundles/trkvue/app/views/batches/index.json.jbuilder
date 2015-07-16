json.items do |json|
	json.array!(@collection) do |batch|
json.(batch, :id,:tid,:stm,:utm,:etm,:vlc,:a_vlc,:dst,:s_lat,:s_lng,:lat,:lng,:c_off,:c_idl,:c_low,:c_nml,:c_hgh,:c_ovr,:sts)
	end
end
json.total @total_count
json.success true
