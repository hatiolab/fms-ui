class ErrorLogsController < ResourceMultiUpdateController
  
private
  def resource_params
    [ params.require(:error_log).permit(:issue_date,:status,:error_type,:message,:uri,:params,:stack_trace) ]
  end
end
