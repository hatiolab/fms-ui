json.items do |json|
	json.array!(@collection) do |report|
		json.(report, :id, :name, :description, :template)

		json.updated_at report.updated_at
		json.updater report.updater, :id, :name if report.updater

		json.created_at report.created_at
		json.creator report.creator, :id, :name if report.creator

		json.template_url report.template ? report.template.url : ''
	end
end

json.total @total_count
json.success true
