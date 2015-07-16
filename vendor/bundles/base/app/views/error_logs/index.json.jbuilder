json.items do |json|
	json.array!(@collection) do |error_log|
json.(error_log, :id,:domain_id,:issue_date,:status,:error_type,:message,:uri,:params,:stack_trace,:creator_id,:created_at)
	end
end
json.total @total_count
json.success true
