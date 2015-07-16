class DiySelection < ActiveRecord::Base
  
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
    
  public
    
    def get_service_url
      'diy_selections/' + self.name + '/query.json';
    end
    
    def to_param
      self.name
    end

    def execute_logic(params)
      if(self.script_type == "SQL")
        return execute_sql_query(self.service_logic, params)
      elsif(self.script_type == "DSL")
        return execute_dsl_logic(params)
      elsif(self.script_type == "DSL-SQL")
        return execute_dsl_sql_logic(params)
      elsif(self.script_type == "JSON")
        return execute_json_logic(params)
      elsif(self.script_type == "XML")
        return execute_xml_logic(params)
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
      return DiySelection.send(:sanitize_sql, sql_arr)
    end
    
    def ready_count_query(query, params)
      real_query = create_real_query(query, params)
      DiySelection.count_by_sql(real_query)
    end

    def ready_query(query, params)
      real_query = create_real_query(query, params)
      DiySelection.connection.select_all(real_query)
    end

    # count query
    def get_count_by_query(count_query, params)
      return ready_count_query(count_query, params)
    end

    # data query
    def get_data_by_query(query, params)
      query_result = ready_query(query, params)
      
      # 결과를 리턴 타입을 키, 결과 값을 값으로 하는 해쉬를 생성
      result_list = query_result.collect do |result|
        result_map = {}
        self.service_out_params.map do |out_param|
          result_map[out_param.name] = result[out_param.name]
        end
        result_map
      end

      return result_list
    end

    # data query
    def execute_sql_query(data_query, params)
      get_data_by_query(data_query, params)
    end

    # dsl-sql
    def execute_dsl_sql_logic(params)
      query = self.instance_eval self.service_logic
      return execute_sql_query(query, params)
    end

    # dsl
    def execute_dsl_logic(params)
      self.instance_eval self.service_logic
    end
    
    # json
    def execute_json_logic(params)
      ActiveSupport::JSON.decode(self.service_logic.strip)
    end
    
    # xml
    def execute_xml_logic(params)
      return self.service_logic
    end
    
    # setup helper
    class SetupHelper
      attr_accessor :service_logic, :in_param_list, :out_param_list

      def initialize
        @count_logic = ""
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
      
      selection = DiySelection.find_by_name(name.to_s)
      selection ||= DiySelection.create(options.merge({:name => name.to_s, :service_logic => setup_helper.service_logic}))
      selection.save
      
      setup_helper.in_param_list.each { |params| selection.service_in_params.create params }
      setup_helper.out_param_list.each { |params| selection.service_out_params.create params }
      selection
    end
end
