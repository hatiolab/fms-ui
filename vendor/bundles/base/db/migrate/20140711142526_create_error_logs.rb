class CreateErrorLogs < ActiveRecord::Migration

	def change
		create_table :error_logs  do |t|
			t.references :domain, :null => false
			t.date :issue_date, :null => false
			t.string :status, :limit => 16
			t.string :error_type, :limit => 128
			t.string :uri, :limit => 1000
			t.text :message
			t.text :params
			t.text :stack_trace
      t.integer :creator_id
      t.datetime :created_at
		end

		add_index :error_logs, [:domain_id,:issue_date], :name => :ix_error_log_0
		add_index :error_logs, [:domain_id,:created_at], :name => :ix_error_log_1
	end

end
