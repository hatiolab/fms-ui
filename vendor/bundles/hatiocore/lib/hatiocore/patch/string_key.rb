# migration id type 바꾸기. integer => string
Object.class_eval do
  def meaningful keys, separator = '-'
    keys.collect{|key| key.class == Symbol ? self.send(key) : key}.join(separator || '-')
  end
end

# userstamp 명세 변경하기.
module Hatio
  module MigrationHelper
    module Userstamp
      def self.included(base) # :nodoc:
        base.send(:include, InstanceMethods)
      end

      module InstanceMethods
        def userstamps(include_deleted_by = false)
          # column(:creator_id, :string, :limit => 16)
          # column(:updater_id, :string, :limit => 16)
          # column(:deleter_id, :string, :limit => 16) if include_deleted_by
          column(:creator_id, :integer)
          column(:updater_id, :integer)
          column(:deleter_id, :integer) if include_deleted_by
        end        
      end
    end
  end
end

ActiveRecord::ConnectionAdapters::TableDefinition.send(:include, Hatio::MigrationHelper::Userstamp)

# oracle default primary key number --> varchar2(64)
if RUBY_PLATFORM =~ /java/
module ::ArJdbc
  module Oracle
    def create_table(table_name, options = {})
      puts "oracel patch"
      table_definition = TableDefinition.new(self)
      table_definition.primary_key(options[:primary_key] || Base.get_primary_key(table_name.to_s.singularize)) unless options[:id] == false || options[:id] == :meaningful || options[:id] == :uuid

      yield table_definition

      if options[:force] && table_exists?(table_name)
        drop_table(table_name, options)
      end

      create_sql = "CREATE#{' TEMPORARY' if options[:temporary]} TABLE "
      create_sql << "#{quote_table_name(table_name)} ("
      create_sql << "id varchar(#{options[:id_limit] || 64}) NOT NULL PRIMARY KEY, " if options[:id] == :meaningful || options[:id] == :uuid
      create_sql << table_definition.to_sql
      create_sql << ") #{options[:options]}"
      execute create_sql
    end
  end
end
end