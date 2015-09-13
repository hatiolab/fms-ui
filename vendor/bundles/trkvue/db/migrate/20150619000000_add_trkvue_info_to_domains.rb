class AddTrkvueInfoToDomains < ActiveRecord::Migration
  def change
    add_column :domains, :status, :string, :limit => 20
    add_column :domains, :reason, :string, :limit => 255
    add_column :domains, :approver_id, :string, :limit => 64
    add_column :domains, :approved_at, :timestamp
    add_column :domains, :email, :string, :limit => 64
    add_column :domains, :address, :string, :limit => 255
    add_column :domains, :service_grade, :string, :limit => 10
    add_column :domains, :lat, :float
    add_column :domains, :lng, :float
    add_column :domains, :last_summary_time, :integer, :default => 0
  end
end