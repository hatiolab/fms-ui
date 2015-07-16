class DiyService < ActiveRecord::Base
  
  include Multitenant
    
  stampable
  strip_cols [:name, :description]
  removing_trackable

	has_many :service_in_params, -> { order('rank asc') }, :as => :resource, :dependent => :destroy
	has_many :service_out_params, -> { order('rank asc') }, :as => :resource, :dependent => :destroy
  
  validates_presence_of :name, :strict => true
  validates :name, length: { in: 2..60 }, :strict => true
  validates :description, length: { maximum: 255 }, :strict => true
  validates_uniqueness_of :name, :strict => true, :scope => :domain_id
  validates_presence_of :script_type, :strict => true
  
  validates_associated :service_in_params
  validates_associated :service_out_params
	
  public
    
    def get_service_url
      'diy_services/' + self.name + '/shoot.json';
    end    
    
    def to_param
      self.name
    end

    def execute_service(params)
      if(self.script_type == "SQL")
        execute_sql_service(self.service_logic, params)
      elsif(self.script_type == "DSL")
        execute_dsl_service(self.service_logic, params)
      elsif(self.script_type == "DSL-SQL")
        execute_dsl_sql_service(self.service_logic, params)
      elsif(self.script_type == "JSON")
        execute_json_service(self.service_logic, params)
      end
    end

  private
    
    #
    # query와 params로 실제 쿼리를 생성하여 리턴한다. 
    # 
    def create_real_query(query, params)
      # 1. 서비스 로직의 :param 문자를 ?로 변경하고 배열에 추가.
      replace_params = query.scan(/:\w+/) if query.scan(/:\+/)

      # 2. 배열의 문자와 매칭되는 파라미터의 값을 ? 에 매핑
      replace_params.each do |replace_param|
        query.sub!(/#{replace_param}/, '?')
      end if replace_params

      sql_params = replace_params.collect do |replace_param|
        replace_param.gsub(/:/, "")
      end if replace_params

      # 3. query parameter matching
      sql_arr = [query]
      sql_params.each { |p| sql_arr << params[p.to_sym] } if(sql_params)
      
      # 4. create real query
      return DiyService.send(:sanitize_sql, sql_arr)
    end

    def execute_sql_service(svc_logic, params)
      real_query = create_real_query(svc_logic, params)
      DiySelection.connection.select_all(real_query)
    end

    def execute_dsl_sql_service(svc_logic, params)
      query = self.instance_eval svc_logic
      execute_sql_service(query, params)
    end

    def execute_dsl_service(svc_logic, params)
      svc_logic = "DiyService.transaction do \n #{svc_logic} \n end" if(self.atomic_flag)  
      self.instance_eval svc_logic
    end
    
    def execute_json_service(svc_logic, params)
      ActiveSupport::JSON.decode(svc_logic.strip)
    end
    
    # setup helper
    class SetupHelper
      attr_accessor :service_logic, :in_param_list, :out_param_list

      def initialize
        @service_logic = ""
        @in_param_list = []
        @out_param_list = []
      end

      def in_params(column_name, options={})
        @in_param_list << options.merge({:name => column_name.to_s, :rank => (@in_param_list.length * 10)})
      end
      
      def out_params(column_name, options={})
        @out_param_list << options.merge({:name => column_name.to_s, :rank => (@out_param_list.length * 10)})
      end
    end
    
    def self.setup(name, options={}, &block)
      setup_helper = SetupHelper.new
      setup_helper.instance_eval &block if block_given?
      
      service = DiyService.find_by_name(name.to_s)
      service ||= DiyService.create(options.merge({:name => name.to_s, :service_logic => setup_helper.service_logic}))
      service.save
      
      setup_helper.in_param_list.each { |params| service.service_in_params.create params }
      setup_helper.out_param_list.each { |params| service.service_out_params.create params }
      service
    end
end