class ListSerializer
  include JSONAPI::Serializer
  attributes :title
  # has_many :items, serializer: ItemSerializer

  attribute :items do |list|
    ItemSerializer.new(list.items).serializable_hash.to_json
    # ItemSerializer.new(list.items.order(position: :asc)).serializable_hash.to_json
  end
end
