import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:flutter_intro/flutter_intro.dart';

import 'package:cunning_document_scanner/cunning_document_scanner.dart';
import 'package:dotted_border/dotted_border.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../config.dart';
import '../../helpers/widgets/my_drop_down_option.dart';
import '../../helpers/widgets/my_drop_down_or_input.dart';
import '../../helpers/widgets/my_image_attachments.dart';
import '../../helpers/widgets/my_popups.dart';
import '../../helpers/widgets/my_radiobutton.dart';
import 'package:http/http.dart' as http;
// Import the http_parser package

import '../../helpers/widgets/my_signiture.dart';
import '../../models/budget_code.dart';
import '../../models/department_code.dart';

class DemoUsageNormal extends StatefulWidget {
  const DemoUsageNormal({Key? key}) : super(key: key);

  @override
  State<DemoUsageNormal> createState() => _DemoUsageNormalState();
}

class _DemoUsageNormalState extends State<DemoUsageNormal> {
  int currentStep = 0;
  String selectedOption = "own";
  String fromDepartment = "";
  String toDepartment = "";
  bool loading = false;

  final transactions = [
    {
      "fromCode": "",
      "toCode": "",
      "reason": "",
      "amount": 0.0,
    }
  ];
  Uint8List? _signatureData;
  final List<String> _pictures = [];

  void setFromDepartment(String department) {
    setState(() {
      fromDepartment = department.split(":")[0];
    });
  }

  void setToDepartment(String department) {
    setState(() {
      toDepartment = department.split(":")[0];
    });
  }

  void setFromCode(String code, index) {
    setState(() {
      transactions[index]["fromCode"] = code.split(":")[0];
    });
  }

  void setToCode(String code, index) {
    setState(() {
      transactions[index]["toCode"] = code.split(":")[0];
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

  void showCustomSnackbar(BuildContext context, String title, String message) {
    final snackBar = SnackBar(
      duration: const Duration(seconds: 4), // Adjust the duration as needed
      content: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.bold),
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
        return true;
      case 1:
        if (fromDepartment.isNotEmpty && toDepartment.isNotEmpty) {
          return true;
        } else {
          return true;
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
    for (int x = 0; x < alldata.length; x++) {
      //print(alldata[x].children);
      if (alldata[x].children != null) {
        for (final data in alldata[x].children!) {
          dataList.add(data);
          if (data.children != null) {
            for (final child in data.children!) {
              dataList.addAll(getAllData([child]));
            }
          }
        }
      }
    }
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
      print("selam");
      if (Platform.isAndroid) {
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
        }
      } else {
        FilePickerResult? result = await FilePicker.platform.pickFiles(
          type: FileType.custom,
          allowedExtensions: ['jpg', 'jpeg', 'png'],
          allowMultiple: true,
        );

        if (result != null) {
          List<String> filePaths = result.files
              .map((file) => file.path!.replaceAll("\\", "/"))
              .toList();
          print(filePaths);
          setState(() {
            _pictures.addAll(filePaths);
          });
        }
      }
    } catch (exception) {
      // Handle exception here
    }
  }

  final GlobalKey<FormState> _formKeyStep1 = GlobalKey<FormState>();
  final GlobalKey<FormState> _formKeyStep2 = GlobalKey<FormState>();
  final GlobalKey<FormState> _formKeyStep3 = GlobalKey<FormState>();
  TextEditingController input1Controller = TextEditingController();

  Future<void> _showSignatureDialog(BuildContext context) async {
    if (Platform.isWindows) {
      await _sendDataToServer();
      return;
    }
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
      print("sending");
      setState(() {
        loading = true;
        showLoadingDialog(context);
      });

      await Future<void>.delayed(const Duration(seconds: 2));
      Navigator.of(context, rootNavigator: true).pop();
      showSuccessDialog(context);
      await Future<void>.delayed(const Duration(seconds: 1));
      Navigator.pushReplacementNamed(context, "/home");
    } catch (error) {
      setState(() {
        Navigator.of(context, rootNavigator: true).pop();
        showErrorDialog(
            context, error.toString(), () => Navigator.of(context).pop());
      });
    }
  }

  final PageController _pageController = PageController();
  int _currentPage = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text(
          "መደበኛ በጀት መለማመጃ",
          style: TextStyle(color: Colors.black),
        ),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (BuildContext context) => Intro(
                    padding: EdgeInsets.zero,
                    borderRadius: const BorderRadius.all(Radius.circular(4)),
                    maskColor: const Color.fromRGBO(0, 0, 0, .6),
                    child: const DemoUsageNormal(),
                  ),
                ),
              );
            },
            icon: const Icon(Icons.info),
          ),
        ],
      ),
      floatingActionButton: IntroStepBuilder(
        /// 1st guide
        order: 1,
        text:
            'Some properties on IntroStepBuilder like `borderRadius` `padding`'
            ' allow you to configure the configuration of this step.',
        padding: const EdgeInsets.symmetric(
          vertical: -5,
          horizontal: -5,
        ),
        borderRadius: const BorderRadius.all(Radius.circular(64)),
        builder: (context, key) => FloatingActionButton(
          key: key,
          child: const Icon(
            Icons.play_arrow,
          ),
          onPressed: () {
            // Intro.of(context).refresh();
            Intro.of(context).start();
          },
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: PageView(
              controller: _pageController,
              onPageChanged: (int page) {
                setState(() {
                  _currentPage = page;
                });
              },
              children: [
                Step1Widget(
                  formKey: _formKeyStep1,
                  onNext: () {
                    if (validateSteps(_currentPage)) {
                      _pageController.nextPage(
                        duration: const Duration(milliseconds: 500),
                        curve: Curves.easeInOut,
                      );
                    }
                  },
                  content: IntroStepBuilder(
                    order: 2,
                    onWidgetLoad: () {
                      Intro.of(context).start();
                    },
                    overlayBuilder: (params) {
                      return Container(
                        padding: const EdgeInsets.all(16),
                        color: Colors.teal,
                        child: Column(
                          children: [
                            const Text(
                              'This is where the action starts huraaa',
                            ),
                            Padding(
                              padding: const EdgeInsets.only(
                                top: 16,
                              ),
                              child: Row(
                                children: [
                                  IntroButton(
                                    onPressed: () async => {
                                      _pageController.previousPage(
                                        duration:
                                            const Duration(milliseconds: 500),
                                        curve: Curves.easeInOut,
                                      ),
                                      await Future<void>.delayed(
                                          const Duration(milliseconds: 800)),
                                      Intro.of(context).refresh()
                                    },
                                    text: 'Prev',
                                  ),
                                  IntroButton(
                                    onPressed: () async => {
                                      _pageController.nextPage(
                                        duration:
                                            const Duration(milliseconds: 500),
                                        curve: Curves.easeInOut,
                                      ),
                                      await Future<void>.delayed(
                                          const Duration(milliseconds: 800)),
                                    },
                                    text: 'Next',
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                    builder: (context, key) => Column(
                      key: key,
                      children: <Widget>[
                        RadioWidget(
                          selectedOption: selectedOption,
                          setSelectedOption: setSelectedOption,
                        ),
                        DropDownOption(
                          setSelectedOption: setFromDepartment,
                          selectedOption: fromDepartment,
                          description: "From Department",
                          fetchFunction: (String filter) async {
                            const secureStorage = FlutterSecureStorage();
                            final token =
                                await secureStorage.read(key: "token");
                            final headers = {
                              "Content-Type": "application/json",
                              'Authorization': 'Bearer $token',
                            };
                            final user = await secureStorage.read(key: "user");
                            final dep = json.decode(user!)["DepartmentID"];

                            final appConfig =
                                AppConfigProvider.of(context)?.appConfig;
                            final url = selectedOption == "own"
                                ? Uri.parse(
                                    '${appConfig?.apiBaseUrl}/department/$dep')
                                : Uri.parse(
                                    '${appConfig?.apiBaseUrl}/department');
                            final response = await http.get(
                              url,
                              headers: headers,
                            );
                            var data = json.decode(response.body);
                            var models = BudgetHierarchy.fromJsonList(data);
                            return getAllData(models)
                                .map((e) => "${e.id}:${e.name}")
                                .toList();
                          },
                        ),
                        DropDownOption(
                          setSelectedOption: setToDepartment,
                          selectedOption: toDepartment,
                          description: "To Department",
                          fetchFunction: (String filter) async {
                            const secureStorage = FlutterSecureStorage();
                            final token =
                                await secureStorage.read(key: "token");
                            final headers = {
                              "Content-Type": "application/json",
                              'Authorization': 'Bearer $token',
                            };
                            final user = await secureStorage.read(key: "user");
                            final dep = json.decode(user!)["DepartmentID"];

                            final appConfig =
                                AppConfigProvider.of(context)?.appConfig;
                            final url = Uri.parse(
                                '${appConfig?.apiBaseUrl}/department/$dep');
                            final response = await http.get(
                              url,
                              headers: headers,
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
                ),
                Step2Widget(
                  formKey: _formKeyStep2,
                  content: IntroStepBuilder(
                    order: 3,
                    onWidgetLoad: () {
                      Intro.of(context).start();
                    },
                    overlayBuilder: (params) {
                      return Container(
                        padding: const EdgeInsets.all(16),
                        color: Colors.teal,
                        child: Column(
                          children: [
                            const Text(
                              'That\'s it, hopefully version 3.0 makes you feel better than 2.0',
                            ),
                            Padding(
                              padding: const EdgeInsets.only(
                                top: 16,
                              ),
                              child: Row(
                                children: [
                                  IntroButton(
                                    onPressed: () async => {
                                      _pageController.previousPage(
                                        duration:
                                            const Duration(milliseconds: 500),
                                        curve: Curves.easeInOut,
                                      ),
                                      await Future<void>.delayed(
                                          const Duration(milliseconds: 800)),

                                    },
                                    text: 'Prev',
                                  ),
                                  IntroButton(
                                    onPressed: () async => {
                                      _pageController.nextPage(
                                        duration:
                                            const Duration(milliseconds: 500),
                                        curve: Curves.easeInOut,
                                      ),
                                      await Future<void>.delayed(
                                          const Duration(milliseconds: 800)),

                                    },
                                    text: 'Next',
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                    builder: (context, key) => Expanded(
                      key: key,
                      child: SizedBox(
                        child: ListView.builder(
                            physics: const ClampingScrollPhysics(),
                            itemCount: transactions.length,
                            itemBuilder: (context, index) {
                              return Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
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
                                      const secureStorage =
                                          FlutterSecureStorage();
                                      final token = await secureStorage.read(
                                          key: "token");
                                      final headers = {
                                        "Content-Type": "application/json",
                                        'Authorization': 'Bearer $token',
                                      };
                                      print(
                                          '${appConfig?.apiBaseUrl}/budgetcode');
                                      final url = Uri.parse(
                                          '${appConfig?.apiBaseUrl}/budgetcode');
                                      final response = await http.get(
                                        url,
                                        headers: headers,
                                      );
                                      var data = json.decode(response.body);
                                      var models =
                                          BudgetCode.fromJsonList(data);
                                      return models
                                          .map((e) =>
                                              "${e.id}: ${e.description}")
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
                                      const secureStorage =
                                          FlutterSecureStorage();
                                      final token = await secureStorage.read(
                                          key: "token");
                                      final headers = {
                                        "Content-Type": "application/json",
                                        'Authorization': 'Bearer $token',
                                      };
                                      print(
                                          '${appConfig?.apiBaseUrl}/budgetcode');
                                      final url = Uri.parse(
                                          '${appConfig?.apiBaseUrl}/budgetcode');
                                      final response = await http.get(
                                        url,
                                        headers: headers,
                                      );
                                      var data = json.decode(response.body);
                                      var models =
                                          BudgetCode.fromJsonList(data);
                                      return models
                                          .map((e) =>
                                              "${e.id}: ${e.description}")
                                          .toList();
                                    },
                                  ),
                                  TextFormField(
                                    initialValue: transactions[index]["amount"]
                                        .toString(),
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
                                    initialvalue: transactions[index]["reason"]
                                        .toString(),
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
                  ),
                  onNext: () {
                    if (validateSteps(_currentPage)) {
                      _pageController.nextPage(
                        duration: const Duration(milliseconds: 500),
                        curve: Curves.easeInOut,
                      );
                    }
                  },
                  onPrevious: () {
                    _pageController.previousPage(
                      duration: const Duration(milliseconds: 500),
                      curve: Curves.easeInOut,
                    );
                  },
                ),
                Step3Widget(
                  formKey: _formKeyStep3,
                  content: IntroStepBuilder(
                    order: 4,
                    onWidgetLoad: () {
                      Intro.of(context).start();
                    },
                    overlayBuilder: (params) {
                      return Container(
                        padding: const EdgeInsets.all(16),
                        color: Colors.teal,
                        child: Column(
                          children: [
                            const Text(
                              'final last',
                            ),
                            Padding(
                              padding: const EdgeInsets.only(
                                top: 16,
                              ),
                              child: Row(
                                children: [
                                  IntroButton(
                                    onPressed: () async => {
                                      _pageController.previousPage(
                                        duration:
                                            const Duration(milliseconds: 500),
                                        curve: Curves.easeInOut,
                                      ),
                                      await Future<void>.delayed(
                                          const Duration(milliseconds: 800)),
                                      params.onPrev,
                                      Intro.of(context).refresh()
                                    },
                                    text: 'Prev',
                                  ),
                                  IntroButton(
                                    onPressed: () => {
                                      Navigator.pop(context),
                                      params.onFinish,
                                      Intro.of(context).refresh()
                                    },
                                    text: 'Finish',
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                    builder: (context, key) => Column(
                      key: key,
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
                  onNext: () {
                    if (validateSteps(_currentPage)) {
                      _showSignatureDialog(context);
                    }
                  },
                  onPrevious: () {
                    _pageController.previousPage(
                      duration: const Duration(milliseconds: 500),
                      curve: Curves.easeInOut,
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class Step1Widget extends StatelessWidget {
  final VoidCallback onNext;
  final Widget content;
  final GlobalKey<FormState> formKey;

  const Step1Widget(
      {super.key,
      required this.onNext,
      required this.content,
      required this.formKey});

  @override
  Widget build(BuildContext context) {
    return Form(
      key: formKey,
      child: Container(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Text('Step 1'),
            content,
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                ElevatedButton(
                  onPressed: onNext,
                  child: const Text('Next'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class Step2Widget extends StatelessWidget {
  final VoidCallback onNext;
  final VoidCallback onPrevious;
  final Widget content;
  final GlobalKey<FormState> formKey;

  const Step2Widget(
      {super.key,
      required this.onNext,
      required this.onPrevious,
      required this.content,
      required this.formKey});

  @override
  Widget build(BuildContext context) {
    return Form(
      key: formKey,
      child: Container(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Step 2'),
            content,
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ElevatedButton(
                  onPressed: onPrevious,
                  child: const Text('Previous'),
                ),
                ElevatedButton(
                  onPressed: onNext,
                  child: const Text('Next'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class Step3Widget extends StatelessWidget {
  final VoidCallback onNext;
  final VoidCallback onPrevious;
  final Widget content;
  final GlobalKey<FormState> formKey;

  const Step3Widget(
      {super.key,
      required this.onNext,
      required this.onPrevious,
      required this.content,
      required this.formKey});

  @override
  Widget build(BuildContext context) {
    return Form(
      key: formKey,
      child: Container(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const Text('Step 3'),
            content,
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ElevatedButton(
                  onPressed: onPrevious,
                  child: const Text('Previous'),
                ),
                ElevatedButton(
                  onPressed: onNext,
                  child: const Text('Finish'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
