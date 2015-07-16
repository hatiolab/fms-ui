# This migration comes from base_engine (originally 20130422063723)
class CreateEntityColumns < ActiveRecord::Migration
  
  def	self.up
    create_table :entity_columns do |t|
      t.references :entity, :null => false
      t.string :name, :null => false, :limit => 32
      t.string :description, :limit => 255
      t.string :term, :limit => 128
      t.string :col_type, :null => false, :limit => 20
      t.integer :col_size
      t.boolean :nullable, :default => true
      t.string :def_val
      t.integer :uniq_rank, :default => 0
      t.string :ref_type, :limit => 20
      t.string :ref_name, :limit => 64
      t.integer :list_rank, :default => 0
      t.integer :disp_rank, :default => 0
    end

    add_index :entity_columns, [:entity_id], :name => :ix_entity_column_0
  end

  def self.down
    add_index :entity_columns, [:entity_id], :name => :ix_entity_column_0
		
    drop_table :entity_columns
  end
end