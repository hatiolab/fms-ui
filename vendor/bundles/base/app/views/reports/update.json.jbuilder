json.(@report, :id, :name, :description, :template)

json.template_url @report.template ? @report.template.url : ''

json.updated_at @report.updated_at
json.updater @report.updater, :id, :name if @report.updater

json.created_at @report.created_at
json.creator @report.creator, :id, :name if @report.creator

json.report_params @report.report_params, :name, :description, :input_type, :ref_type, :ref_name, :rank
