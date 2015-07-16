module Hatio
  module Generators
    class ReportViewUtil
  
      def self.generateStore(domain, out_params)
        output = "fields : [\n\t\t\t"    
        columnList = out_params.collect { |column| "{ name : '#{column.name}', type : 'string' }" }
        output << columnList.join(",\n\t\t\t")
        output << "\n\t\t]"
        output
      end
  
      def self.generateColumns(domain, out_params)
        output = "columns : [\n\t\t"
        columnList = out_params.collect { |column| "{ header : T('label.#{column.name}'), dataIndex : '#{column.name}' }" }
        output << columnList.join(",\n\t\t")
        output << "\n\t]"
        output
      end
  
      def self.generate_search_items(domain, in_params)
        output = "items : [\n\t\t"
        columnList = in_params.collect { |column| "{ name : '#{column.name}', fieldLabel : T('label.#{column.name}') }" }
        output << columnList.join(",\n\t\t")
        output << "\n\t]"
        output
      end
  
    end
    
  end
end