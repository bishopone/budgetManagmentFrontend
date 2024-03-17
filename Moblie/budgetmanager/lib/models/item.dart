class Item {
  String ID;
  String Name;
  List<Item>? Children;

  Item({
    required this.ID,
    required this.Name,
    this.Children,
  });

  // Static method to convert a list of dynamic data to a list of Item objects
  static List<Item> fromJsonList(List<dynamic> jsonList) {
    return jsonList.map((item) {
      return Item(
        ID: item['ID'] as String,
        Name: item['Name'] as String,
        Children: item['Children'] != null
            ? Item.fromJsonList(item['Children'] as List<dynamic>)
            : null,
      );
    }).toList();
  }
}
