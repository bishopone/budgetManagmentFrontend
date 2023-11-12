class RejectReason {
  final int id;
  final String reason;
  final int type;

  RejectReason({required this.id, required this.reason, required this.type});

  factory RejectReason.fromJson(Map<String, dynamic> json) {
    return RejectReason(
      id: json['id'] as int,
      reason: json['reason'] as String,
      type: json['type'] as int,
    );
  }

  static List<RejectReason> listFromJson(List<dynamic> json) {
    return json.map((item) => RejectReason.fromJson(item)).toList();
  }
}
