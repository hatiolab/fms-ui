class ShiftsController < DomainResourcesController

  # GET /shifts/1
  def current_work_date
    @shift = Shift.default_shift
    cwd = @shift.current_work_date
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :work_date => cwd} }
      format.json { render :json => {:success => true, :work_date => cwd} }
    end    
  end
    
  # GET /shifts/1
  def show
    @shift = Shift.default_shift
    unless @shift
      @shift = Shift.new({
        :name => 'System',
        :domain_id => @domain.id, 
        :default_flag => true,
        :total_shift => 2, 
        :shift1_start => '08:00', :shift1_end => '20:00', 
        :shift2_start => '20:00', :shift2_end => '08:00',
        :shift1_start_add => 0, :shift1_end_add => 0, 
        :shift2_start_add => 0, :shift2_end_add => 1
       })
      @shift.save
    end
  end
  
  def to_events
    if(params[:start].blank? || params[:end].blank?)
      today = Date.today
      params[:start] = (today.beginning_of_month.beginning_of_week - 1).strftime("%m-%d-%Y")
      params[:end] = (today.end_of_month.end_of_week - 1).strftime("%m-%d-%Y")
    end
    
    calendar_dates = Calendar.find_by(name: 'Work').calendar_dates.where(
      sys_date: Date.strptime(params[:start], '%m-%d-%Y')..Date.strptime(params[:end], '%m-%d-%Y')
    )
  
    total_shift = Shift.first.total_shift
    @events = []

    calendar_dates.each do |calendar_date|
      1.upto(total_shift) do |shift|
        @events.push({
          :id => "#{calendar_date.id}_#{shift}",
          :ad => false,
          :cid => shift,
          :shift => shift,
          :sys_date => calendar_date.sys_date.to_s,
          :title => "Shift #{shift}",
          :start => calendar_date["shift#{shift}_start"].strftime("%Y-%m-%d %H:%M:%S"),
          :end => calendar_date["shift#{shift}_start"].strftime("%Y-%m-%d %H:%M:%S"),
          :shift_start => calendar_date["shift#{shift}_start"].strftime("%Y-%m-%d %H:%M:%S"),
          :shift_end => calendar_date["shift#{shift}_end"].strftime("%Y-%m-%d %H:%M:%S")
        })
      end
    end
    
    @total_count = @events.length
  end

private
  def resource_params
    [ params.require(:shift).permit(:total_shift,:shift1_start,:shift2_start,:shift3_start,:shift1_end,:shift2_end,:shift3_end,:name,:system_flag,:shift1_start_add_date,:shift1_end_add_date,:shift2_start_add_date,:shift2_end_add_date,:shift3_start_add_date,:shift3_end_add_date) ]
  end
  
end
