# This migration comes from base_engine (originally 20130604052822)
class CreateContacts < ActiveRecord::Migration
  def change
    create_table :contacts do |t|
      t.references :domain, :null => false
			t.string :name, :null => false
			t.string :description
      t.string :family_name
      t.string :given_name
      t.string :alias
      t.string :company
      t.string :department
      t.string :title
			t.string :email
			t.string :phone_office
      t.string :phone_mobile
      t.string :fax
      t.string :address
			t.userstamps
			t.timestamps
			
    end

    add_index :contacts, [:domain_id, :name], :unique => false, :name => :ix_contacts_0		
  end
end
