class CalendarDatesController < ResourceMultiUpdateController

private
  def resource_params
    [ params.require(:calendar_date).permit(:description, :sys_date, :dayoff_flag, :work_hours, :plan_year, :plan_month, :plan_week, :iso_year, :julian_day, :plan_quarter, :week_day, :start_time, :shift1_start, :shift1_end, :shift2_start, :shift2_end, :shift3_start, :shift3_end, :shift4_start, :shift4_end) ]
  end

end
