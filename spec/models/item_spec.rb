require 'rails_helper'

RSpec.describe Item, type: :model do
  it { is_expected.to belong_to :list }
  it { is_expected.to validate_presence_of(:title) }
  it { is_expected.to have_many(:item_members).dependent(:destroy) }
  it { is_expected.to have_many(:members).through(:item_members).source(:user) }

  # describe "assign_user_as_member" do
  #   it "assings the creator of the item as one of its members" do
  #     user = create(:user)
  #     item = create(:item, user: user)
  #     expect(item.members).to include(user)
  #   end
  # end
end
