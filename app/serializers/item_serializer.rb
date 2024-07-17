class ItemSerializer
  include JSONAPI::Serializer
  attributes :title, :list_id, :description

  attribute :members do |item|
    UserSerializer.new(item.members).serializable_hash.to_json  
  end
end
