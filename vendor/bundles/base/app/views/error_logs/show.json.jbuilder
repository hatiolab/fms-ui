json.(@error_log, :id,:domain_id,:issue_date,:status,:error_type,:message,:uri,:params,:stack_trace,:creator_id,:created_at)

json.creator @error_log.creator, :id, :name if @error_log.creator
