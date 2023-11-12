import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:cunning_document_scanner/cunning_document_scanner.dart';
import 'package:dotted_border/dotted_border.dart';
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
import '../../helpers/widgets/my_image_attachments.dart';

class SafeBudget extends StatefulWidget {
  @override
  _SafeBudgetState createState() => _SafeBudgetState();
}

class _SafeBudgetState extends State<SafeBudget> {
  int currentStep = 0;
  String selectedOption = "own";
  String fromDepartment = "";
  String toDepartment = "";

  final transactions = [
    {
      "fromCode": "",
      "toCode": "",
      "reason": "",
      "amount": 0.0,
    }
  ];
  Uint8List? _signatureData;
  List<String> _pictures = [];

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

  void setFromCode(String code, index) {
    setState(() {
      transactions[index]["fromCode"] = code;
    });
  }

  void setToCode(String code, index) {
    setState(() {
      transactions[index]["toCode"] = code;
    });
  }

  void setReason(String newReason, index) {
    setState(() {
      transactions[index]["reason"] = newReason;
    });
  }

  void setAmount(double newAmount, index) {
    setState(() {
      transactions[index]["amount"] = newAmount;
    });
  }

  void setSelectedOption(String option) {
    setState(() {
      selectedOption = option;
      fromDepartment = "";
      toDepartment = "";
    });
  }

  void onPressed() async {
    List<String> pictures;
    try {
      if (_pictures.length <= 5) {
        pictures = await CunningDocumentScanner.getPictures() ?? [];
        if (!mounted) return;
        if (_pictures.length + pictures.length > 5) {
          showCustomSnackbar(
              context, 'Error', 'You can only send a maximum of 5 Images!!');
          return;
        }
        setState(() {
          _pictures.addAll(pictures);
        });
      } else {
        showCustomSnackbar(
            context, 'Error', 'You can only send a maximum of 5 Images!!');
      }
    } catch (exception) {
      print(exception);
      // Handle exception here
    }
  }

  void showCustomSnackbar(BuildContext context, String title, String message) {
    final snackBar = SnackBar(
      duration: Duration(seconds: 4), // Adjust the duration as needed
      content: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            title,
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          Text(message),
        ],
      ),
      action: SnackBarAction(
        label: 'Close',
        onPressed: () {
          ScaffoldMessenger.of(context).removeCurrentSnackBar();
        },
      ),
    );

    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }

  bool validateSteps(int curent) {
    switch (curent) {
      case 0:
        if (fromDepartment.isNotEmpty && toDepartment.isNotEmpty) {
          return true;
        } else {
          return false;
        }
      case 1:
        return true;

      default:
        {
          return true;
        }
    }
  }

  List<BudgetHierarchy> getAllData(List<BudgetHierarchy> alldata) {
    List<BudgetHierarchy> dataList = [];
    // print(alldata.length);
    for (int x = 0; x < alldata.length; x++) {
      //print(alldata[x].children);
      if (alldata[x].children != null) {
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

      if (token == null) {
        Navigator.pushReplacementNamed(context, '/auth');
      }
      var totalAmount = transactions.fold(0.0,
          (amount, transaction) => amount + (transaction["amount"] as double));

      final appConfig = AppConfigProvider.of(context)?.appConfig;
      print('${appConfig?.apiBaseUrl}/budget/normal');
      final url = Uri.parse('${appConfig?.apiBaseUrl}/budget/treasury');
      final request = http.MultipartRequest('POST', url);
      print(_signatureData?.length);
      // Add the signature data as a file
      final httpImage = http.MultipartFile.fromBytes(
          'signature', _signatureData!,
          contentType: MediaType('image', 'png'), filename: 'signature.png');
      _pictures.forEach((image) async {
        var addDt = DateTime.now();
        var multipartFile = await http.MultipartFile.fromPath(
          'attachment',
          image,
          contentType: MediaType('image', 'png'),
          filename: 'attachment_${addDt}_${image}_.png',
        );
        request.files.add(multipartFile);
      });

      request.files.add(httpImage);
      request.fields.addAll({
        "RequestFor": selectedOption,
        "BudgetTypeID": "1",
        "RequestStatus": "Pending",
        "From": fromDepartment.split(' ')[0],
        "To": toDepartment.split(' ')[0],
        "Transaction": jsonEncode(transactions),
        "Type": '3',
        "Amount": totalAmount.toString()
      });

      // Set headers including the authorization header
      request.headers['Authorization'] = 'Bearer $token';

      // Send the request
      final response = await request.send();

      print(response.statusCode);
      if (response.statusCode == 200) {
        Navigator.of(context, rootNavigator: true).pop();
        showSuccessDialog(context);
        await Future<void>.delayed(const Duration(seconds: 2));
        // Navigator.pushReplacementNamed(context, "/home");
      } else {
        final errorMessage = await response.stream.bytesToString();
        Navigator.of(context, rootNavigator: true).pop();
        showErrorDialog(
            context, errorMessage, () => Navigator.of(context).pop());
      }
    } catch (error) {
      print(error);
      setState(() {
        Navigator.of(context, rootNavigator: true).pop();
        showErrorDialog(
            context, error.toString(), () => Navigator.of(context).pop());
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text(
          "መጠባበቂያ  በጀት",
          style: TextStyle(color: Colors.black),
        ),
        actions: [
          IconButton(
              onPressed: () {
                Navigator.pushNamed(context, "/information",
                    arguments: {"title": "normal budget"});
              },
              icon: const Icon(Icons.info))
        ],
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
                              ? currentStep == 2
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
                      title: const Text('Step 1'),
                      content: Column(
                        children: <Widget>[
                          DropDownOption(
                            setSelectedOption: setFromDepartment,
                            selectedOption: fromDepartment,
                            description: "From Treasury",
                            fetchFunction: (String filter) async {
                              const secureStorage = FlutterSecureStorage();
                              final user =
                                  await secureStorage.read(key: "user");
                              final dep = json.decode(user!)["DepartmentID"];

                              final appConfig =
                                  AppConfigProvider.of(context)?.appConfig;
                              print('${appConfig?.apiBaseUrl}/department');
                              final url = Uri.parse(
                                  '${appConfig?.apiBaseUrl}/department/500');
                              final response = await http.get(
                                url,
                                headers: {"Content-Type": "application/json"},
                              );
                              print(response.body);
                              var data = json.decode(response.body);
                              var models = BudgetHierarchy.fromJsonList(data);
                              return getAllData(models)
                                  .map((e) => "${e.id}: ${e.name}")
                                  .toList();
                            },
                          ),
                          DropDownOption(
                            setSelectedOption: setToDepartment,
                            selectedOption: toDepartment,
                            description: "To Department",
                            fetchFunction: (String filter) async {
                              const secureStorage = FlutterSecureStorage();
                              final user =
                                  await secureStorage.read(key: "user");
                              final dep = json.decode(user!)["DepartmentID"];
                              final appConfig =
                                  AppConfigProvider.of(context)?.appConfig;
                              final url = Uri.parse(
                                  '${appConfig?.apiBaseUrl}/department/${dep}');
                              final response = await http.get(
                                url,
                                headers: {"Content-Type": "application/json"},
                              );
                              var data = json.decode(response.body);
                              var models = BudgetHierarchy.fromJsonList(data);
                              return getAllData(models)
                                  .map((e) => "${e.id}: ${e.name}")
                                  .toList();
                            },
                          ),
                        ],
                      ),
                    ),
                    Step(
                      title: const Text('Step 2'),
                      content: SizedBox(
                        width: 300,
                        height: 300,
                        child: ListView.builder(
                            itemCount: transactions.length,
                            itemBuilder: (context, index) {
                              return Column(
                                children: [
                                  DropDownOption(
                                    setSelectedOption: (str) =>
                                        setFromCode(str, index),
                                    selectedOption: transactions[index]
                                        ["fromCode"] as String,
                                    description: "From Code",
                                    fetchFunction: (String filter) async {
                                      final appConfig =
                                          AppConfigProvider.of(context)
                                              ?.appConfig;
                                      print(
                                          '${appConfig?.apiBaseUrl}/budgetcode');
                                      final url = Uri.parse(
                                          '${appConfig?.apiBaseUrl}/budgetcode');
                                      final response = await http.get(
                                        url,
                                        headers: {
                                          "Content-Type": "application/json"
                                        },
                                      );
                                      var data = json.decode(response.body);
                                      var models =
                                          BudgetCode.fromJsonList(data);
                                      return models
                                          .map((e) =>
                                              "${e.id} : ${e.description}")
                                          .toList();
                                    },
                                  ),
                                  DropDownOption(
                                    setSelectedOption: (str) =>
                                        setToCode(str, index),
                                    selectedOption:
                                        transactions[index]["toCode"] as String,
                                    description: "To Code",
                                    fetchFunction: (String filter) async {
                                      final appConfig =
                                          AppConfigProvider.of(context)
                                              ?.appConfig;
                                      print(
                                          '${appConfig?.apiBaseUrl}/budgetcode');
                                      final url = Uri.parse(
                                          '${appConfig?.apiBaseUrl}/budgetcode');
                                      final response = await http.get(
                                        url,
                                        headers: {
                                          "Content-Type": "application/json"
                                        },
                                      );
                                      var data = json.decode(response.body);
                                      var models =
                                          BudgetCode.fromJsonList(data);
                                      return models
                                          .map((e) =>
                                              "${e.id} : ${e.description}")
                                          .toList();
                                    },
                                  ),
                                  TextFormField(
                                    onChanged: (val) =>
                                        setAmount(double.parse(val), index),
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
                                    index: index,
                                    setReason: setReason,
                                  ),
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      if (index == transactions.length - 1)
                                        ElevatedButton(
                                            onPressed: () {
                                              setState(() {
                                                transactions.add({
                                                  "fromCode": "",
                                                  "toCode": "",
                                                  "reason": "",
                                                  "amount": 0.0,
                                                });
                                              });
                                            },
                                            child: const Icon(Icons.add)),
                                      ElevatedButton(
                                          onPressed: () => {
                                                setState(() {
                                                  transactions.removeAt(index);
                                                })
                                              },
                                          child: const Icon(Icons.delete)),
                                    ],
                                  ),
                                ],
                              );
                            }),
                      ),
                    ),
                    Step(
                      title: const Text(
                        'Step 3',
                        style: TextStyle(color: Colors.black),
                      ),
                      content: Column(
                        children: [
                          InkWell(
                            onTap: onPressed,
                            child: DottedBorder(
                              color: Colors.black,
                              strokeWidth: 2,
                              dashPattern: const [
                                5,
                                5,
                              ],
                              child: Container(
                                  padding: const EdgeInsets.all(16.0),
                                  child: const Icon(Icons.image)),
                            ),
                          ),
                          const SizedBox(
                            height: 10,
                          ),
                          SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            child: ImageWidget(
                              pictures: _pictures,
                            ),
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
