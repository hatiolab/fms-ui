json.items do |json|
	json.array!(@collection) do |diy_report|

		json.(diy_report, :id, :name, :description, :diy_selection_id)

		json.updated_at diy_report.updated_at
		json.updater diy_report.updater, :id, :name if diy_report.updater

		json.diy_selection diy_report.diy_selection, :id, :name if diy_report.diy_selection
	end
end

json.total @total_count
json.success true
