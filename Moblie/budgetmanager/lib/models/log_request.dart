class BudgetLog {
  int logID;
  int requestID;
  String oldState;
  String newState;
  DateTime changeDate;
  int changedByUserID;
  String changedByUserName;
  String PhoneNumber;
  String ProfilePictureLink;

  BudgetLog({
    required this.logID,
    required this.requestID,
    required this.oldState,
    required this.newState,
    required this.changeDate,
    required this.changedByUserID,
    required this.changedByUserName,
    required this.PhoneNumber,
    required this.ProfilePictureLink,
  });

  factory BudgetLog.fromJson(Map<String, dynamic> json) {
    return BudgetLog(
      logID: json['LogID'] ?? 0,
      requestID: json['RequestID'] ?? 0,
      oldState: json['OldState'] ?? "",
      newState: json['NewState'] ?? "",
      changeDate: DateTime.parse(json['ChangeDate']),
      changedByUserID: json['ChangedByUserID'] ?? 0,
      changedByUserName: json['ChangedByUserName'] ?? "",
      PhoneNumber: json['PhoneNumber'] ?? "",
      ProfilePictureLink: json['ProfilePictureLink'] ?? "",
    );
  }
}
