class CreateEntityLogics < ActiveRecord::Migration
  
  def	change
    create_table :entity_logics do |t|
      t.references :entity, :null => false
      t.string :name, :null => false, :limit => 64
      t.string :description, :limit => 255
      t.string :level, :limit => 10 # class or instance
      t.text :logic
      t.userstamps
      t.timestamps
    end

    add_index :entity_logics, [:entity_id, :name], :name => :ix_entity_logic_0
  end
end