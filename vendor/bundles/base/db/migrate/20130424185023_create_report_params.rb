class CreateReportParams < ActiveRecord::Migration
  
  def change
    create_table :report_params do |t|
      t.references :report, :null => false
      t.string :name, :null => false, :limit => 64
			t.string :description, :limit => 255
			t.string :input_type, :null => false, :limit => 20
			t.string :ref_type, :limit => 20
			t.string :ref_name, :limit => 64
			t.integer :rank, :default => 0
    end

    add_index :report_params, [:report_id], :name => :ix_report_param_0
  end
end
