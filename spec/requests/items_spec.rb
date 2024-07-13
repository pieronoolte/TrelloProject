require 'rails_helper'

RSpec.describe "Boards", type: :request do
  let(:user) { create(:user) }
  let(:board) { create(:board, user: user) }
  let(:list) { create(:list, board: board) }
  before do
    sign_in user
  end
  describe "GET new" do
    it "succeeds" do
      get new_list_item_path(list)
      expect(response).to have_http_status(:success)
    end
  end

  # describe "GET edit" do
  #   it "succeeds" do
  #     get edit_board_list_path(board, list)
  #     expect(response).to have_http_status(:success)
  #   end
  # end


  describe "POST create" do
    context "with valid params" do
      it "creates a new item and redirects" do 
        expect do
          post list_items_path(list), params: {
            item: {
              title: "New Item",
              description: "Description"
            }
          }
        end.to change { Item.count }.by(1)
        expect(response).to have_http_status(:redirect)
      end
    end

    context "with invalid params" do
      it "does not create a new item and renders new" do 
        expect do 
          post list_items_path(list), params: {
            item: {
              title: "",
              description: ""
            }
          }
        end.not_to change { Item.count }
        expect(response).to have_http_status(:success)
      end
    end
  end

  # describe "PUT update" do
  #   context "with valid params" do
  #     it "update the list and redirects" do 
  #       expect do
  #         put board_list_path(board, list), params: {
  #           list: {
  #             title: "Updated List"
  #           }
  #         }
  #       end.to change { list.reload.title }.to("Updated List")
  #       expect(response).to have_http_status(:redirect)
  #     end
  #   end

  #   context "with invalid params" do
  #     it "does not update the list and renders edit" do 
  #       expect do 
  #         put board_list_path(board, list), params: {
  #           list: {
  #             title: ""
  #           }
  #         }
  #       end.not_to change { list.reload.title }
  #       expect(response).to have_http_status(:success)
  #     end
  #   end
  # end

  # describe "DELETE destroy" do
  #   it "deletes the list record" do
  #     list
  #     expect do
  #       delete board_list_path(board, list)
  #     end.to change { List.count }.by(-1)
  #     expect(response).to have_http_status(:success)
  #   end
  # end
  
end