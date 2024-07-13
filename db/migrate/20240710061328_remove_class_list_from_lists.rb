class RemoveClassListFromLists < ActiveRecord::Migration[7.1]
  def change
    remove_column :lists, :class_list
  end
end
