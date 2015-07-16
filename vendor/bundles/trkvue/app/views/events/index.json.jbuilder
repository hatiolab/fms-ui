json.items do |json|
	json.array!(@collection) do |event|
		json.(event, :id,:dom,:fid,:fvr,:did,:tid,:bid,:gid,:etm,:ctm,:kct,:typ,:vlc,:svr,:lat,:lng,:gx,:gy,:gz,:vdo,:f_vdo,:r_vdo,:ado)
	end
end
json.total @total_count
json.success true
