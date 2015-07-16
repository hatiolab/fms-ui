json.(@diy_report, :id, :name, :description, :diy_selection_id)

json.updated_at @diy_report.updated_at
json.updater @diy_report.updater, :id, :name if @diy_report.updater

json.created_at @diy_report.created_at
json.creator @diy_report.creator, :id, :name if @diy_report.creator

json.service_url @diy_report.diy_selection ? @diy_report.diy_selection.get_service_url : ''

json.diy_selection @diy_report.diy_selection, :id, :name if @diy_report.diy_selection

json.service_in_params @diy_report.diy_selection.service_in_params, :name, :description, :rank if @diy_report.diy_selection
json.service_out_params @diy_report.diy_selection.service_out_params, :name, :description, :rank if @diy_report.diy_selection
