class BudgetHierarchy {
  final String id;
  final String name;
  final int isSelectable;
  final String Type;
  final List<BudgetHierarchy>? children;

  BudgetHierarchy( {
    required this.id,
    required this.name,
    required this.Type,
    required this.isSelectable,
    this.children,
  });

  factory BudgetHierarchy.fromJson(Map<String, dynamic> json) {
    List<dynamic>? jsonChildren = json['Children'];

    List<BudgetHierarchy>? parsedChildren;

    if (jsonChildren != null) {
      parsedChildren = jsonChildren
          .map((childJson) => BudgetHierarchy.fromJson(childJson))
          .toList();
    }
print(json);
    return BudgetHierarchy(
      id: json['ID'],
      name: json['Name'],
      Type: json['Type'],
      isSelectable: json['isSelectable'] ?? 0,
      children: parsedChildren,
    );
  }

  static List<BudgetHierarchy> fromJsonList(List<dynamic> jsonList) {
    return jsonList.map((json) => BudgetHierarchy.fromJson(json)).toList();
  }
}
