# This migration comes from base_engine (originally 20130617052651)
class CreateRemTraces < ActiveRecord::Migration

	def change
		create_table :rem_traces do |t|
			t.references :domain, :null => false
			t.string :name, :limit => 128
      t.references :entity, :polymorphic => true
			t.text :content
			t.userstamps
			t.timestamps
		end

		add_index :rem_traces, [:domain_id, :entity_type], :name => :ix_rem_trace_0
		add_index :rem_traces, [:domain_id, :updated_at], :name => :ix_rem_trace_1
	end

end
