class ListsController < ApplicationController
  before_action :authenticate_user!

  protect_from_forgery with: :null_session, only: :destroy
  def new
    @list = board.lists.new
  end

  def edit
    @list = board.lists.find(params[:id])
  end


  def create
    @list = board.lists.new(list_params)

    if @list.save
      redirect_to board_path(board)
    else
      render :new
    end
  end

  def update
    @list = board.lists.find(params[:id])
    if @list.update(list_params)
      redirect_to board_path(board)
    else
      render :edit
    end
  end

  def destroy 
    @list = board.lists.find(params[:id])
    @list.destroy
  end

  private

  def list_params
    params.require(:list).permit(:title)
  end

  def board 
    @board ||= Board.find(params[:board_id])
  end
end