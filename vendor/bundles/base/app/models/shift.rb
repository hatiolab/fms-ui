class Shift < ActiveRecord::Base
  
  include Multitenant
  
  def self.default_shift
    Shift.where("default_flag = ?", true).first
  end

  def parse_time str
    if ActiveRecord::Base.default_timezone == :utc
      domain_timezone = self.domain.timezone.blank? ? ActiveSupport::TimeZone[current_user.timezone] : ActiveSupport::TimeZone[self.domain.timezone.to_s]
      domain_timezone.parse(str)
    else
      Time.parse(str)
    end
  end
  
  def work_calendar
    #Calendar.find_by_name(self.id.to_s)
    Calendar.find(self.id.to_s)
  end
  
  #
  # work_date, shift의 실제 시작 시간(시스템 시간)을 리턴한다.
  #
  def shift_start_time(work_date, shift)
    shift = shift.to_i if(shift.class.name == 'String')
    return nil if(shift > self.total_shift)
    shift_start = self.send "shift#{shift}_start"
    # 각 shift start 실제 시간을 WorkDate 에서 하루를 더할 건지 뺄건지 그대로 할 건지는 shift{index}_start_add에서 설정한다.
    add_work_date = self.send "shift#{shift}_start_add"
    sis_date = work_date + add_work_date.to_i
    return parse_time "#{sis_date} #{shift_start}"
  end

  #
  # work_date, shift의 실제 완료 시간(시스템 시간)을 리턴한다.
  #
  def shift_end_time(work_date, shift)
    shift = shift.to_i if(shift.class.name == 'String')
    return nil if(shift > self.total_shift)
    shift_end = self.send "shift#{shift}_end"
    # 각 shift start 실제 시간을 WorkDate 에서 하루를 더할 건지 뺄건지 그대로 할 건지는 shift{index}_end_add에서 설정한다.
    add_work_date = self.send "shift#{shift}_end_add"
    sis_date = work_date + add_work_date.to_i
    return parse_time "#{sis_date} #{shift_end}"
  end

  #
  # time에 대한 work_date를 계산한다.
  #
  def work_date(time)
    date = time.to_date
    shift_first_start = self.shift_start_time(date, 1)
    shift_last_end = self.shift_end_time(date, self.total_shift)
    if time < shift_first_start
      return date - 1
    elsif time >= shift_last_end
      return date + 1
    else
      return date
    end
  end

  #
  # time에 대한 work_date, shift를 계산한다.
  #
  def wd_shift(time)
    date = work_date(time)
    return nil if date.nil?
    shift = (1..self.total_shift).detect do |i_shift|
      sst = self.shift_start_time(date, i_shift)
      set = self.shift_end_time(date, i_shift)
      (time >= sst && time <= set)
    end
    [date, shift]
  end

  #
  # time에 대한 shift를 계산한다.
  #
  def shift(time)
    wd_shift(time)[1]
  end

  #
  # 현재 시간으로 work_date를 구해서 리턴한다.
  #
  def current_work_date
    work_date(Time.now)
  end

  #
  # 현재 시간으로 shift를 구해서 리턴한다.
  #
  def current_shift
    shift(Time.now)
  end
  
  #
  # 현 시간부터 다음 Shift 시작시간까지 남은 시간 (millisecond) 리턴
  #
  def shift_change_delay
    vwd_shift = self.wd_shift(Time.now)
    v_work_date = vwd_shift[0]
    v_shift = vwd_shift[1]
    next_work_date, next_shift = v_work_date, v_shift + 1
    if(next_shift > self.total_shift)
      next_work_date = next_work_date + 1
      next_shift = 1 
    end
    next_shift_start_time = self.shift_start_time(next_work_date, next_shift)
    (1000 * (next_shift_start_time - Time.now).to_i)
  end
  
end
