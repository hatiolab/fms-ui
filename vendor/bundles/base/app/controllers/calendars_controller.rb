class CalendarsController < ResourceMultiUpdateController
  
  def calendar_dates
    @calendar = Calendar.find(params[:id])
    
    start_date = params[:startDate]
    end_date = params[:endDate]
    
    @calendar_dates = @calendar.calendar_dates.where(sys_date: parse_date(params[:startDate])..parse_date(params[:endDate]))
  end
  
private
  def resource_params
    [ params.require(:calendar).permit(:name,:description,:day1_off_flag,:day2_off_flag,:day3_off_flag,:day4_off_flag,:day5_off_flag,:day6_off_flag,:day7_off_flag,:day1_workhour,:day2_workhour,:day3_workhour,:day4_workhour,:day5_workhour,:day6_workhour,:day7_workhour) ]
  end
  
end
