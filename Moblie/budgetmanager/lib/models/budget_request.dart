class BudgetRequest {
  int requestID;
  int requesterID;
  DateTime requestDate;
  String requestStatus;
  int fromDep;
  int toDep;
  int fromBudgetCode;
  int toBudgetCode;
  double amount;
  String reason;
  int type;
  String signatureFilename;

  BudgetRequest({
    required this.requestID,
    required this.requesterID,
    required this.requestDate,
    required this.requestStatus,
    required this.fromDep,
    required this.toDep,
    required this.fromBudgetCode,
    required this.toBudgetCode,
    required this.amount,
    required this.reason,
    required this.type,
    required this.signatureFilename,
  });

  factory BudgetRequest.fromJson(Map<String, dynamic> json) {
    print(json);
    try{
    return BudgetRequest(
        requestID: json['RequestID'] ?? 0, // Provide a default value of 0
        requesterID: json['RequesterID'] ?? 0,
        requestDate: DateTime.parse(json['RequestDate'] ?? ""),
        requestStatus: json['RequestStatus'] ?? "",
        fromDep: int.tryParse(json['BudgetFrom'].toString() ?? "0") ?? 0,
        toDep: int.tryParse(json['BudgetTo'].toString() ?? "0") ?? 0,
        fromBudgetCode: json['FromBudgetCode'] ?? 0,
        toBudgetCode: json['ToBudgetCode'] ?? 0,
        amount: double.tryParse(json['Amount'] ?? "") ?? 0.0, // Provide a default value of 0.0
        reason: json['Reason'] ?? "",
        type: json['Type'] ?? 0,
        signatureFilename: json['SignatureFilename'] ?? "",
    );
  }catch(x){
      print(x);
      throw x;
    };}
  static List<BudgetRequest> fromJsonList(List<dynamic> jsonList) {
    return jsonList.map((json) => BudgetRequest.fromJson(json)).toList();
  }
}
