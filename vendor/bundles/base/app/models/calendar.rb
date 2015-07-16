class Calendar < ActiveRecord::Base
  include Multitenant
    
	stampable

	has_many :calendar_dates

  def build_calendar params
    shift = Shift.find_by_domain_id(self.domain_id)
    raise "Shift of Domain [#{self.domain_id}] not found!" unless shift
    start_base = Date.new.change(:year => params[:year].to_i, :month => params[:start_month].to_i)
    end_base = Date.new.change(:year => params[:year].to_i, :month => params[:end_month].to_i)

    calendar_start_date = start_base.beginning_of_month
  	calendar_end_date = end_base.end_of_month

    holiday_options = {}
    workhour_options = {}
    j = nil
    
    domain_timezone = self.domain.timezone ? ActiveSupport::TimeZone[self.domain.timezone.to_s] : ActiveSupport::TimeZone[User.current_user.timezone]

    (1..7).each do |i|
      i == 1 ? j = 7 : j = i - 1
      holiday_options[j] = self["day#{i}_off_flag"]
      workhour_options[j] = self["day#{i}_workhour"]
    end

    (calendar_start_date..calendar_end_date).each do |date|
      options = {}
      options[:domain_id] = self.domain_id
      options[:sys_date] = date
      options[:dayoff_flag] = holiday_options[date.cwday]
      options[:work_hours] = workhour_options[date.cwday]
      options[:plan_year] = date.year
      options[:plan_month] = date.month
      options[:plan_week] = date.cweek
      options[:iso_year] = date.iso_year
      options[:julian_day] = date.yday
      options[:plan_quarter]  = (date.month / 4).to_i + 1
      options[:week_day] = date.wday

      (1..4).each do |i|
        start_time = shift["shift#{i}_start"]
        end_time = shift["shift#{i}_end"]
        
        unless start_time.blank? && end_time.blank?
          if "#{options[:sys_date]} #{start_time}".to_datetime > "#{options[:sys_date]} #{end_time}".to_datetime
            if i == 1
              start_time = "#{options[:sys_date] - 1} #{start_time}"
              end_time = "#{options[:sys_date]} #{end_time}"
            else
              start_time = "#{options[:sys_date]} #{start_time}"
              end_time = "#{options[:sys_date] + 1} #{end_time}"
            end
          else
            start_time = "#{options[:sys_date]} #{start_time}"
            end_time = "#{options[:sys_date]} #{end_time}"
          end

          if ActiveRecord::Base.default_timezone == :utc
            options[:"shift#{i}_start"] = domain_timezone.parse(start_time)
            options[:"shift#{i}_end"] = domain_timezone.parse(end_time)
          else
            options[:"shift#{i}_start"] = Time.parse(start_time)
            options[:"shift#{i}_end"] = Time.parse(end_time)
          end

        end
      end

      day = self.calendar_dates.find_by_sys_date(options[:sys_date])

      if day.blank?
        self.calendar_dates.create(options)
      else
        day.update_attributes(options)
      end
    end
  end
end
