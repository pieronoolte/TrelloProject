class ItemMembersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_item
  before_action :set_board

  def index 
    @members = @board.members
    @item_member = @item.item_members.new
  end
  
  def new
    @item_member = @item.item_members.new
  end

  def show 
    authorize board
  end

  def create
    user_to_assign = User.where(id: user_ids)

    @item.members  << user_to_assign

    redirect_to board_path(set_board), notice: 'Members were successfully added.'
  end

  def destroy 
    authorize board
    # board.destroy 
    # redirect_to root_path
  end

  private

  def user_ids
    params[:item_member][:user_ids].map(&:to_i).reject(&:zero?)
  end

  # def item
  #   @item ||= Item.find(params[:item_id])
  # end

  # def list 
  #   @list ||= List.find(item.list_id)
  # end

  # def board 
  #   @board ||= Board.find(list.board_id)
  # end

  def set_item
    @item = Item.find(params[:item_id])
  end

  def set_board 
    @board = @item.list.board
  end
end