class BudgetCode {
  final int id;
  final String description;

  BudgetCode({required this.id, required this.description});

  factory BudgetCode.fromJson(Map<String, dynamic> json) {
    return BudgetCode(
      id: json['id'] as int,
      description: json['description'] as String,
    );
  }
  static List<BudgetCode> fromJsonList(List<dynamic> jsonList) {
    return jsonList.map((json) => BudgetCode.fromJson(json)).toList();
  }
}
