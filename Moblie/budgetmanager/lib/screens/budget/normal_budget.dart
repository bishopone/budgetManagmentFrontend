import 'dart:convert';
import 'dart:typed_data';
import 'package:http_parser/http_parser.dart'; // Import the http_parser package

import 'package:dropdown_search/dropdown_search.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

import '../../config.dart';
import '../../helpers/widgets/my_popups.dart';
import '../../helpers/widgets/my_signiture.dart';
import '../../helpers/widgets/my_radiobutton.dart';
import '../../helpers/widgets/my_drop_down_option.dart';
import '../../helpers/widgets/my_drop_down_or_input.dart';
import '../../models/budget_code.dart';
import '../../models/department_code.dart';

class NormalBudget extends StatefulWidget {
  @override
  _NormalBudgetState createState() => _NormalBudgetState();
}

class _NormalBudgetState extends State<NormalBudget> {
  int currentStep = 0;
  String selectedOption = "own";
  String fromDepartment = "";
  String toDepartment = "";
  String fromCode = "";
  String toCode = "";
  String reason = "";
  double amount = 0.0;
  Uint8List? _signatureData;

  void setFromDepartment(String department) {
    setState(() {
      fromDepartment = department;
    });
  }

  void setToDepartment(String department) {
    setState(() {
      toDepartment = department;
    });
  }

  void setFromCode(String code) {
    setState(() {
      fromCode = code;
    });
  }

  void setToCode(String code) {
    setState(() {
      toCode = code;
    });
  }

  void setReason(String newReason) {
    setState(() {
      reason = newReason;
    });
  }

  void setAmount(double newAmount) {
    setState(() {
      amount = newAmount;
    });
  }

  void setSelectedOption(String option) {
    setState(() {
      selectedOption = option;
      fromDepartment = "";
      toDepartment = "";
      fromCode = "";
      toCode = "";
      reason = "";
      amount = 0.0;
    });
  }

  bool validateSteps(int curent) {
    switch (curent) {
      case 0:
        return true;
      case 1:
          if (fromDepartment.isNotEmpty && toDepartment.isNotEmpty) {
            return true;
          } else {
            return false;
          }
      case 2:
          if (fromCode.isNotEmpty && toCode.isNotEmpty) {
            return true;
          } else {
            return false;
          }
      case 3:
        if (selectedOption == "own") {
          if (reason.isNotEmpty) {
            return true;
          } else {
            return false;
          }
        } else {
          if (amount != 0.0 && reason.isNotEmpty) {
            return true;
          } else {
            return false;
          }
        }
      default:
        {
          return true;
        }
    }
  }

  List<BudgetHierarchy> getAllData(List<BudgetHierarchy> alldata) {
    List<BudgetHierarchy> dataList = [];
    // print(alldata.length);
    for (int x=0 ; x < alldata.length ; x++) {
      //print(alldata[x].children);
      if(alldata[x].children!= null) {
        for (final data in alldata[x].children!) {
          print(data);
          dataList.add(data);
          if (data.children != null) {
            for (final child in data.children!) {
              dataList.addAll(getAllData([child]));
            }
          }
        }
      }
    }
    print("dataList");
    print(dataList.map((e) => print(e.name)));
    return dataList;
  }
  Widget customStepIcon(int index, int current) {
    if (index == current || index > current) {
      return Container(
        width: 40.0,
        height: 40.0,
        decoration: const BoxDecoration(
          shape: BoxShape.circle,
          color: Colors.white, // Circle color
        ),
        child: Center(
          child: Text(
            (index + 1).toString(),
            style: const TextStyle(color: Colors.black87),
          ),
        ),
      );
    } else {
      return Container(
        width: 40.0,
        height: 40.0,
        decoration: const BoxDecoration(
          shape: BoxShape.circle,
          color: Colors.white, // Circle color
        ),
        child: const Center(
          child: Icon(
            Icons.check,
            color: Colors.green, // Active and inactive colors
          ),
        ),
      );
    }
  }

  GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  TextEditingController input1Controller = TextEditingController();

  void _showSignatureDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
            Container(
              padding: const EdgeInsets.all(16.0),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.all(Radius.circular(50)),
              ),
              child: SignatureCaptureWidget(
                onSubmit: (Uint8List signatureData) async {
                  Navigator.of(context).pop(); // Close the dialog
                  setState(() {
                    _signatureData = signatureData;
                  });
                  await _sendDataToServer();
                },
              ),
            ),
          ]),
        );
      },
    );
  }

  Future<void> _sendDataToServer() async {
    try {
      const secureStorage = FlutterSecureStorage();
      final token = await secureStorage.read(key: "token");
      final user = await secureStorage.read(key: "user");
      final dep = json.decode(user!)["DepartmentID"];

      if (token == null) {
        Navigator.pushReplacementNamed(context, '/auth');
      }

      final appConfig = AppConfigProvider.of(context)?.appConfig;
      print('${appConfig?.apiBaseUrl}/budget/normal');
      final url = Uri.parse('${appConfig?.apiBaseUrl}/budget/normal');

      // Create a multipart request
      final request = http.MultipartRequest('POST', url);
      print(_signatureData?.length);
      // Add the signature data as a file
      final httpImage = http.MultipartFile.fromBytes(
          'signature', _signatureData!,
          contentType: MediaType('image', 'png'), filename: 'signature.png');
      request.files.add(httpImage);
      request.fields.addAll({
        "RequestFor": selectedOption,
        "BudgetTypeID": "1",
        "RequestStatus": "Pending",
        "FromDep": fromDepartment.split(' ')[0],
        "ToDep": toDepartment.split(' ')[0],
        "FromBudgetCode": fromCode.split(' ')[0],
        "ToBudgetCode": toCode.split(' ')[0],
        "Amount": amount.toString(),
        "Reason": reason,
        "Type": '1',
      });

      // Set headers including the authorization header
      request.headers['Authorization'] = 'Bearer $token';

      // Send the request
      final response = await request.send();

      if (response.statusCode == 201) {
        Navigator.of(context, rootNavigator: true).pop();
        showSuccessDialog(context);
        await Future<void>.delayed(const Duration(seconds: 2));
        Navigator.pushReplacementNamed(context, "/home");
      } else {
        final errorMessage = await response.stream.bytesToString();
        // Navigator.of(context, rootNavigator: true).pop();
        // showErrorDialog(context, errorMessage, () => Navigator.of(context).pop());
      }
    } catch (error) {
      print(error);
      setState(() {
        // Navigator.of(context, rootNavigator: true).pop();
        // showErrorDialog(context, error.toString(), () => Navigator.of(context).pop());
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text(
          "መደበኛ በጀት",
          style: TextStyle(color: Colors.black),
        ),
      ),
      body: Container(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: <Widget>[
              Expanded(
                child: Stepper(
                  stepIconBuilder: (index, stepIsActive) {
                    return customStepIcon(index, currentStep);
                  },
                  onStepTapped: (step) {
                    setState(() {
                      if (currentStep > step) {
                        currentStep = step;
                      }
                    });
                  },
                  currentStep: currentStep,
                  onStepContinue: () {
                    print(currentStep);
                    print(validateSteps(currentStep));
                    if (currentStep < 3 && validateSteps(currentStep)) {
                      setState(() {
                        currentStep++;
                      });
                    }
                  },
                  onStepCancel: () {
                    if (currentStep > 0) {
                      setState(() {
                        currentStep--;
                      });
                    }
                  },
                  controlsBuilder:
                      (BuildContext context, ControlsDetails Detail) {
                    return Row(
                      children: <Widget>[
                        ElevatedButton(
                          onPressed: validateSteps(currentStep)
                              ? currentStep == 3
                                  ? () => _showSignatureDialog(context)
                                  : Detail.onStepContinue
                              : null,
                          child: Text(currentStep == 3 ? 'Confirm' : 'Next'),
                        ),
                        const SizedBox(width: 16.0),
                        if (currentStep > 0)
                          ElevatedButton(
                            onPressed: Detail.onStepCancel,
                            child: const Text('Previous'),
                          ),
                      ],
                    );
                  },
                  steps: [
                    Step(
                      title: const Text(
                        'Step 1',
                        style: TextStyle(color: Colors.black),
                      ),
                      content: RadioWidget(
                        selectedOption: selectedOption,
                        setSelectedOption: setSelectedOption,
                      ),
                    ),
                    Step(
                      title: const Text('Step 2'),
                      content: Column(
                        children: <Widget>[
                          DropDownOption(
                            setSelectedOption: setFromDepartment,
                            selectedOption: fromDepartment,
                            description: "From Department",
                            fetchFunction: (String filter) async {
                              const secureStorage = FlutterSecureStorage();
                              final user = await secureStorage.read(key: "user");
                              final dep = json.decode(user!)["DepartmentID"];

                              final appConfig =
                                  AppConfigProvider
                                      .of(context)
                                      ?.appConfig;
                              print('${appConfig?.apiBaseUrl}/department');
                              final url = selectedOption == "own"? Uri.parse(
                                  '${appConfig?.apiBaseUrl}/department/$dep'): Uri.parse(
                                  '${appConfig?.apiBaseUrl}/department');
                              final response = await http.get(
                                url,
                                headers: {"Content-Type": "application/json"},
                              );
                              var data = json.decode(response.body);
                              var models =
                              BudgetHierarchy.fromJsonList(data);
                              return  selectedOption == "own" ?models.map((e) => "${e.id}: ${e.name}")
                                  .toList() :getAllData(models)
                                  .map((e) => "${e.id}: ${e.name}")
                                  .toList();       },
                          ),
                          DropDownOption(
                            setSelectedOption: setToDepartment,
                            selectedOption: toDepartment,
                            description: "To Department",
                            fetchFunction: (String filter) async {
                              const secureStorage = FlutterSecureStorage();
                              final user = await secureStorage.read(key: "user");
                              final dep = json.decode(user!)["DepartmentID"];

                              final appConfig =
                                  AppConfigProvider
                                      .of(context)
                                      ?.appConfig;
                              print('${appConfig?.apiBaseUrl}/department/$dep');
                              final url =  selectedOption == "own" ? Uri.parse(
                                  '${appConfig?.apiBaseUrl}/department/$dep'): Uri.parse(
                                  '${appConfig?.apiBaseUrl}/department');
                              final response = await http.get(
                                url,
                                headers: {"Content-Type": "application/json"},
                              );
                              var data = json.decode(response.body);
                              var models = BudgetHierarchy.fromJsonList(data);
                              return  selectedOption == "own" ?models.map((e) => "${e.id}: ${e.name}")
                                  .toList() :getAllData(models)
                                  .map((e) => "${e.id}: ${e.name}")
                                  .toList();
                            },
                          ),
                        ],
                      ),
                    ),
                    Step(
                      title: const Text('Step 3'),
                      content: Column(
                        children: <Widget>[
                          DropDownOption(
                            setSelectedOption: setFromCode,
                            selectedOption: fromCode,
                            description: "From Code",
                            fetchFunction: (String filter) async {
                              final appConfig =
                                  AppConfigProvider.of(context)?.appConfig;
                              print('${appConfig?.apiBaseUrl}/budgetcode');
                              final url = Uri.parse(
                                  '${appConfig?.apiBaseUrl}/budgetcode');
                              final response = await http.get(
                                url,
                                headers: {"Content-Type": "application/json"},
                              );
                              var data = json.decode(response.body);
                              var models = BudgetCode.fromJsonList(data);
                              return models
                                  .map((e) => "${e.id} : ${e.description}")
                                  .toList();
                            },
                          ),
                          DropDownOption(
                            setSelectedOption: setToCode,
                            selectedOption: toCode,
                            description: "To Code",
                            fetchFunction: (String filter) async {
                              final appConfig =
                                  AppConfigProvider.of(context)?.appConfig;
                              print('${appConfig?.apiBaseUrl}/budgetcode');
                              final url = Uri.parse(
                                  '${appConfig?.apiBaseUrl}/budgetcode');
                              final response = await http.get(
                                url,
                                headers: {"Content-Type": "application/json"},
                              );
                              var data = json.decode(response.body);
                              var models = BudgetCode.fromJsonList(data);
                              return models
                                  .map((e) => "${e.id} : ${e.description}")
                                  .toList();
                            },
                          ),
                        ],
                      ),
                    ),
                    Step(
                      title: const Text('Step 4'),
                      content: Column(
                        children: <Widget>[
                          TextFormField(
                            onChanged: (val) => setAmount(double.parse(val)),
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(
                              labelText: 'Birr (Amount)',
                              hintText: 'Enter the amount in Birr',
                            ),
                            validator: (value) {
                              if (value!.isEmpty) {
                                return 'Please enter the amount in Birr';
                              }
                              // You can add additional validation here if needed.
                              return null;
                            },
                          ),
                          DropdownOrInputField(
                            setReason: setReason,
                          ),
                          const SizedBox(
                            height: 50,
                          )
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
