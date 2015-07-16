class CreateEntityProperties < ActiveRecord::Migration
  
  def	change
    create_table :entity_properties do |t|
      t.references :entity, :null => false
      t.string :name, :null => false, :limit => 64
			t.string :description, :limit => 255
			t.string :attribute_type, :null => false, :limit => 20
			t.string :ref_type, :limit => 20
			t.string :ref_name, :limit => 64
			t.boolean :editable, :default => false
			t.integer :disp_rank, :default => 0
    end

    add_index :entity_properties, [:entity_id], :name => :ix_entity_prop_0
  end
end