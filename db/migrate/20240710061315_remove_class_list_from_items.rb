class RemoveClassListFromItems < ActiveRecord::Migration[7.1]
  def change
    remove_column :items, :class_list
  end
end
