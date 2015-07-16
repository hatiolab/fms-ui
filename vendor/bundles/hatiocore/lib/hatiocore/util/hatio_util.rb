module Hatio
  module Util
    # Simple util class
    module HatioUtil
      
      # for debug
      def debug_print(obj)
        puts "*" * 30
        puts obj
        puts "*" * 30
      end
      
      #
      # UUID 생성 
      #
      def generateUUID
        Digest::SHA1.hexdigest(Time.now.to_s.split(//).sort_by {rand}.join).to_s
        # UUIDTools::UUID.timestamp_create().to_s
      end
      
      # time string을 db time으로 변경 
      def parse_time_to_db(strtime)
        convert_time_to_db Time.zone.parse(strtime)
      end

      # time string을 db time으로 변경 
      def convert_time_to_db(time)
        if ActiveRecord::Base.default_timezone == :utc
          time.to_time.utc
        else
          time.to_time.localtime
        end
      end
      
      # save data
      # def save_data(entity, data, user)
      #   data[:creator_id] = user.id
      #   data[:updater_id] = user.id
      #   return entity.create(data, :without_protection => true)
      # end
      
      # parameter empty check
      def empty_param?(params, name)
        name = name.to_s
        return (params[name].nil? || params[name].empty?)
      end
      
      # 필수 파라미터 체크 
      def check_required_param(params, name)
        raise StandardError, "Parameter #{name} is required!" if(!params.key?(name.to_s) || params[name.to_s].blank?)
      end
         
      # 필수 파라미터 리스트 체크 
      def check_required_params(params, name_arr)
        name_arr.each { |name| check_required_param(params, name) }
      end
      
      #단일 날짜를 between 으로 변경
      def convert_date_bet_cond(date)
        "between ? and ?"
      end
      
      #
      def convert_date_eq_cond(date)
        "Date'#{date}'"
      end
      
      #
      # server configuration에서 지정된 포맷대로 date_str을 파싱하여 date 객체를 리턴 
      #
      def parse_date(date_str)
        begin
          return Date.strptime(date_str, GlobalConfig.date_format)
        rescue ::Exception => e
          return Date.parse(date_str)
        end
      end
      
      #
      # server configuration에서 지정된 포맷대로 date_str을 파싱하여 date 객체를 리턴 
      #
      def to_std_date_str(date_str)
        return parse_date(date_str).to_s
      end
      
      #
      # server configuration에서 지정된 포맷대로 date_str을 파싱하여 date 객체를 리턴 
      #
      def parse_time(time_str)
        begin
          return Time.strptime(time_str, GlobalConfig.datetime_format)
        rescue ::Exception => e
          return Time.parse(time_str)
        end
      end
      
      #
      # server configuration에서 지정된 포맷대로 date_str을 파싱하여 date 객체를 리턴 
      #
      def to_std_time_str(time_str)
        return parse_time(time_str).to_s
      end
      
    end
  end
end