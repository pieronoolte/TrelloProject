class BoardUsersController < ApplicationController
  before_action :authenticate_user!

  def index 
    @members = board.members
    @board_user = board.board_users.new
    binding.pry
  end
  def new
    @board_user = board.board_users.new
  end

  def show 
    authorize board
  end

  def create
    # binding.pry
    user_to_assign = User.where(id: user_ids)

    board.members  << user_to_assign

    redirect_to new_board_board_user_path(@board), notice: 'Members were successfully added.'
  end

  def destroy 
    authorize board
    board.destroy 
    redirect_to root_path
  end

  private

  def user_ids
    params[:board_user][:user_ids].map(&:to_i).reject(&:zero?)
  end

  def board
    @board ||= Board.find(params[:board_id])
  end
end