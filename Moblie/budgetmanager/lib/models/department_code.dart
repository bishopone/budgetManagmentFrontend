class BudgetHierarchy {
  final String id;
  final String name;
  final List<BudgetHierarchy>? children;

  BudgetHierarchy({
    required this.id,
    required this.name,
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

    return BudgetHierarchy(
      id: json['ID'],
      name: json['Name'],
      children: parsedChildren,
    );
  }

  static List<BudgetHierarchy> fromJsonList(List<dynamic> jsonList) {
    return jsonList.map((json) => BudgetHierarchy.fromJson(json)).toList();
  }
}
