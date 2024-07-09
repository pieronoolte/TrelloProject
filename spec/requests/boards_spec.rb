require 'rails_helper'

RSpec.describe "Boards", type: :request do
  let(:user) { create(:user) }
  let(:board) { create(:board, user: user) }
  before do
    sign_in user
  end
  describe "GET new" do
    it "succeeds" do
      get new_board_path
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET edit" do
    it "succeeds" do
      get edit_board_path(board)
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET show" do
    it "succeeds" do
      get board_path(board)
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST create" do
    context "with valid params" do
      it "creates a new board and redirects" do 
        expect do
          post boards_path, params: {
            board: {
              name: "New Board"
            }
          }
        end.to change { Board.count }.by(1)
        expect(response).to have_http_status(:redirect)
      end
    end

    context "with invalid params" do
      it "does not create a new board and renders new" do 
        expect do 
          post boards_path, params: {
            board: {
              name: ""
            }
          }
        end.not_to change { Board.count }
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe "PUT update" do
    context "with valid params" do
      it "update the board and redirects" do 
        expect do
          put board_path(board), params: {
            board: {
              name: "Updated Board"
            }
          }
        end.to change { board.reload.name }.to("Updated Board")
        expect(response).to have_http_status(:redirect)
      end
    end

    context "with invalid params" do
      it "does not update the board and renders edit" do 
        expect do 
          put board_path(board), params: {
            board: {
              name: ""
            }
          }
        end.not_to change { board.reload.name }
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe "DELETE destroy" do
    it "deletes the board record" do
      board
      expect do
        delete board_path(board)
      end.to change { Board.count }.by(-1)
      expect(response).to have_http_status(:redirect)
    end
  end
  
end