class CapitalProjects {
  final String id;
  final String name;
  final String department;

  CapitalProjects({
    required this.id,
    required this.name,
    required this.department,
  });

  factory CapitalProjects.fromJson(Map<String, dynamic> json) {
    return CapitalProjects(
      id: formatDateString(json['id'] as String),
      name: json['name'] as String,
      department: json['department'] as String,
    );
  }

  static List<CapitalProjects> fromJsonList(List<dynamic> jsonList) {
    return jsonList.map((json) => CapitalProjects.fromJson(json)).toList();
  }
}
String formatDateString(String input) {
  // Ensure the input is 10 characters long
  if (input.length != 10) {
    return input; // Return the input as-is if it doesn't match the expected length
  }

  // Split the input string into segments
  String segment1 = input.substring(0, 3);   // "111"
  String segment2 = input.substring(3, 5);   // "01"
  String segment3 = input.substring(5, 7);   // "01"
  String segment4 = input.substring(7, 10);  // "014"

  // Concatenate the segments with slashes
  String formattedString = '$segment1/$segment2/$segment3/$segment4';

  return formattedString;
}
