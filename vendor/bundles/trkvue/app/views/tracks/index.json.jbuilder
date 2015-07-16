json.items do |json|
	json.array!(@collection) do |track|
json.(track, :id,:dom,:fid,:fvr,:tid,:bid,:did,:stm,:ttm,:ctm,:kct,:vlc,:a_vlc,:dst,:lat,:lng,:p_lat,:p_lng,:gx,:gy,:gz,:f_img,:r_img)
	end
end
json.total @total_count
json.success true
