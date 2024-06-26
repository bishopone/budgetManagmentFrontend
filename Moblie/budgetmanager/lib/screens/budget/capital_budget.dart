import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:cunning_document_scanner/cunning_document_scanner.dart';
import 'package:flutter/services.dart';
import 'package:http_parser/http_parser.dart'; // Import the http_parser package
import '../../helpers/widgets/my_custom_drop_down.dart';
import '../../helpers/widgets/my_popups.dart';

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

import '../../config.dart';
import '../../helpers/widgets/my_product_card.dart';
import '../../helpers/widgets/my_signiture.dart';
import '../../helpers/widgets/my_radiobutton.dart';
import '../../helpers/widgets/my_drop_down_option.dart';
import '../../helpers/widgets/my_drop_down_or_input.dart';
import '../../models/budget_code.dart';
import '../../models/capital_project.dart';
import '../../models/department_code.dart';
import 'package:flutter_intro/flutter_intro.dart';

import '../PDFViewerScreen.dart';
import 'intro_normal_budget.dart';
import 'package:file_picker/file_picker.dart';

class CapitalBudget extends StatefulWidget {
  const CapitalBudget({super.key});

  @override
  _CapitalBudgetState createState() => _CapitalBudgetState();
}

class _CapitalBudgetState extends State<CapitalBudget> {
  int currentStep = 0;
  String selectedOption = "own";
  String fromDepartment = "";
  String toDepartment = "";
  bool loading = false;
  List<dynamic> documents = [];
  List<TextEditingController> controllers = [];

  @override
  void initState() {
    super.initState();
    // Add initial controller
    controllers.add(TextEditingController());
  }
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
      getRequiredDocuments();
    });
  }

  void setToDepartment(String department) {
    setState(() {
      toDepartment = department.split(":")[0];
      getRequiredDocuments();

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

  void displayProportionalWidthMessage(BuildContext context, String message) {
    // Calculate the width based on the length of the message
    double screenWidth = MediaQuery.of(context).size.width;
    double proportionalWidth = screenWidth * 0.8; // Adjust the factor as needed

    // Display a SnackBar at the bottom of the screen
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Container(
          width: proportionalWidth,
          child: Text(message),
        ),
        duration: Duration(seconds: 2), // Adjust the duration as needed
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  bool checksteptwo() {
    final value = transactions.any((e) =>
    e["fromCode"] == "" ||
        e["toCode"] == "" ||
        e["reason"] == "" ||
        e["amount"] == 0.0);
    return !value;
  }

  bool validateSteps(int curent) {
    switch (curent) {
      case 0:
        if (fromDepartment.isNotEmpty &&
            toDepartment.isNotEmpty &&
            fromDepartment != '/' &&
            toDepartment != '/') {
          return true;
        }
        displayProportionalWidthMessage(context,
            "ከ የመንግስት መ/ቤት / ፕሮግራም / የሥራ ክፍል ወደ የመንግስት መ/ቤት / ፕሮግራም / የሥራ ክፍል መምረጥ አለቦት።");
        return false;
      case 1:
        if (checksteptwo()) {
          return true;
        }
        displayProportionalWidthMessage(
            context, "አንዳንድ መረጃ ባዶ ናቸው እባክዎ አንዱን ይምረጡ");

        return false;


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
  Future<void> getRequiredDocuments() async {
    const secureStorage = FlutterSecureStorage();
    final token = await secureStorage.read(key: "token");
    final headers = {
      "Content-Type": "application/json",
      'Authorization': 'Bearer $token',
    };
    final appConfig = AppConfigProvider.of(context)?.appConfig;
    final url = Uri.parse('${appConfig?.apiBaseUrl}/budgetsteps/identify?type=${2}&from=${fromDepartment}&to=${toDepartment}');

    var response = await http.get(
      url,
      headers: headers,
    );

    if (response.statusCode == 200) {
      var data = json.decode(response.body);
      print("lit");
      print(data);
      setState(() {
        documents =  data;
      });
    } else {
      throw Exception('Failed to fetch images: ${response.statusCode}');
    }
  }

  void setSelectedOption(String option) {
    setState(() {
      selectedOption = option;
      fromDepartment = "";
      toDepartment = "";
    });
  }
  Future<List<dynamic>> fetchImages() async {
    const secureStorage = FlutterSecureStorage();
    final token = await secureStorage.read(key: "token");
    final headers = {
      "Content-Type": "application/json",
      'Authorization': 'Bearer $token',
    };
    final appConfig = AppConfigProvider.of(context)?.appConfig;
    final url = Uri.parse('${appConfig?.apiBaseUrl}/temporaryattachment');

    var response = await http.get(
      url,
      headers: headers,
    );

    if (response.statusCode == 200) {
      var data = json.decode(response.body);
      for (int index = 0; index < data.length; index++) {
        String filePath = data[index]['FilePath'];
        filePath = filePath.replaceAll('\\', '/');
        data[index]['webpath'] = '${appConfig?.apiBaseUrl}/$filePath';
      }
      return data;
    } else {
      throw Exception('Failed to fetch images: ${response.statusCode}');
    }
  }

  void onPressed(int index) async {
    List<String> pictures;
    try {
      if (Platform.isAndroid) {
        pictures = await CunningDocumentScanner.getPictures() ?? [];
        if (!mounted) return;

        setState(() {
          documents[index]['pics'].add(pictures[0]);
        });

      } else {
        FilePickerResult? result = await FilePicker.platform.pickFiles(
          type: FileType.custom,
          allowedExtensions: ['png'],
        );

        if (result != null) {
          List<String> filePaths = result.files
              .map((file) => file.path!.replaceAll("\\", "/"))
              .toList();
          print(filePaths);
          setState(() {
            documents[index]['pics'].addAll(filePaths);
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
  Future<void> _showpdffile() async {
    final appConfig = AppConfigProvider.of(context)?.appConfig;

    const secureStorage = FlutterSecureStorage();
    final token = await secureStorage.read(key: "token");
    print(token);
    if (token == null) {
      Navigator.pushReplacementNamed(context, '/auth');
      return;
    }

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return PDFViewerModal(
          token: token,
          transactions: transactions,
          selectedOption: selectedOption,
          fromDepartment: fromDepartment,
          toDepartment: toDepartment,
          link: appConfig!.apiBaseUrl, pictures: documents, onFinish: _sendDataToServer , type:"2"

        );
      },
    );
  }

  Future<void> _showSignatureDialog(BuildContext context) async {
    if(Platform.isWindows){
      await _showpdffile();
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
      print(toDepartment);
      const secureStorage = FlutterSecureStorage();
      final token = await secureStorage.read(key: "token");

      if (token == null) {
        Navigator.pushReplacementNamed(context, '/auth');
      }
      setState(() {
        loading = true;
        showLoadingDialog(context);
      });
      var totalAmount = transactions.fold(0.0,
              (amount, transaction) => amount + (transaction["amount"] as double));

      final appConfig = AppConfigProvider.of(context)?.appConfig;
      final url = Uri.parse('${appConfig?.apiBaseUrl}/budget/capital');
      final request = http.MultipartRequest('POST', url);
      // Add the signature data as a file
      if (_signatureData != null) {
        final httpImage = http.MultipartFile.fromBytes(
            'signature', _signatureData!,
            contentType: MediaType('image', 'png'), filename: 'signature.png');
        request.files.add(httpImage);
      }
      // _pictures.forEach((image) async {
      //   var addDt = DateTime.now();
      //   print(image);
      //   if (image.startsWith('http')) {
      //     // If the image is a URL, download it and add it to the request
      //     var response = await http.get(Uri.parse(image));
      //     var imageBytes = response.bodyBytes;
      //     var multipartFile = http.MultipartFile.fromBytes(
      //       'attachment',
      //       imageBytes,
      //       filename: 'attachment_${addDt}_${image.split('/').last.replaceAll(".jpg", "")}.png',
      //       contentType: MediaType('image', 'png'),
      //     );
      //     request.files.add(multipartFile);
      //   } else {
      //     // If the image is a local file path, add it directly to the request
      //     var file = File(image);
      //     var multipartFile = await http.MultipartFile.fromPath(
      //       'attachment',
      //       file.path,
      //       filename: 'attachment_${addDt}_${image.replaceAll(".jpg", "")}.png',
      //       contentType: MediaType('image', 'png'),
      //     );
      //     request.files.add(multipartFile);
      //   }
      // });
      List<String> TempImage = [];

      documents.forEach((value) async {
        value['pics'].forEach((image) async {
          print("imageimageimageimage");
          print(image);
          var addDt = DateTime.now();
          print(image);
          if (image.startsWith('http')) {
            TempImage.add(image);
          } else {
            // If the image is a local file path, add it directly to the request
            var file = File(image);
            var multipartFile = await http.MultipartFile.fromPath(
              'attachment',
              file.path,
              filename: 'attachment_${addDt}_${image.replaceAll(
                  ".jpg", "")}.png',
              contentType: MediaType('image', 'png'),
            );
            request.files.add(multipartFile);
          }
        });
      });

      request.fields.addAll({
        "RequestFor": selectedOption,
        "BudgetTypeID": "1",
        "RequestStatus": "Pending",
        "From": fromDepartment.split(':')[0].replaceAll('/', ''),
        "To": toDepartment.split(':')[0].replaceAll('/', ''),
        "TempImage": jsonEncode(TempImage),
        "Transaction": jsonEncode(transactions),
        "Type": '2',
        "Amount": totalAmount.toString()
      });

      // Set headers including the authorization header
      request.headers['Authorization'] = 'Bearer $token';

      // Send the request
      final response = await request.send();

      if (response.statusCode == 200) {
        Navigator.of(context, rootNavigator: true).pop();
        showSuccessDialog(context);
        await Future<void>.delayed(const Duration(seconds: 1));
        Navigator.pushReplacementNamed(context, "/home");
      } else {
        final errorMessage = await response.stream.bytesToString();
        print(errorMessage);
        Navigator.of(context, rootNavigator: true).pop();
        showErrorDialog(
            context, errorMessage, () => Navigator.of(context).pop());
      }
    } catch (error) {
      setState(() {
        Navigator.of(context, rootNavigator: true).pop();
        showErrorDialog(
            context, error.toString(), () => Navigator.of(context).pop());
      });
    }
  }

  void iterate(List<Map<String, dynamic>> data, List<Map<String, dynamic>> departments) {
    data.forEach((item) {
      List<Map<String, dynamic>> matchingDepartments = departments.where((dep) => dep['department'] == item['ID'].toString()).toList();
      matchingDepartments.forEach((dep) {
        if (item['Children'] == null) {
          item['Children'] = [];
        }
        item['Children'].add({
          'ID': dep['id'],
          'Name': dep['name'],
          'Type': 'capital',
          'Children': null,
        });
      });
      if (item['Children'] != null) {
        iterate(item['Children'], departments);
      }
    });
  }

  String reverseFormatDateString(String formattedString) {
    // Remove slashes from the formatted string
    String stringWithoutSlashes = formattedString.replaceAll('/', '');

    // Ensure the resulting string has a length of 10
    if (stringWithoutSlashes.length != 10) {
      return formattedString; // Return the formatted string as-is if it doesn't match the expected length
    }

    return stringWithoutSlashes;
  }

  final PageController _pageController = PageController();
  int _currentPage = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text(
          "ካፒታል በጀት",
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
                  content: Column(
                    children: <Widget>[
                      RadioWidget(
                        selectedOption: selectedOption,
                        setSelectedOption: setSelectedOption,
                      ),
                      SizedBox(
                        height: 5,
                      ),
                      Divider(),
                      SizedBox(
                        height: 10,
                      ),
                      SizedBox(
                        width: double.infinity,
                        height: 400,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Expanded(
                              child: Column(
                                children: [
                                  SizedBox(
                                    height: 100,
                                    child: Text(
                                      fromDepartment,
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 20),
                                    ),
                                  ),
                                  Expanded(
                                    child: StatefulBuilder(
                                        builder: (context, setState) {
                                          return TreeViewComponent(
                                            type: 'capital',
                                            choiceSetter: setFromDepartment,
                                            selectedOption: selectedOption,
                                            choices: fromDepartment,
                                            description:
                                            "ከ የመንግስት መ/ቤት / ፕሮግራም / የሥራ ክፍል",
                                            fetchFunction: () async {
                                              const secureStorage = FlutterSecureStorage();
                                                        final token = await secureStorage.read(key: "token");
                                                        final headers = {
                                                          "Content-Type": "application/json",
                                                          'Authorization': 'Bearer $token',
                                                        };
                                                        final user =
                                                        await secureStorage.read(key: "user");
                                                        final dep = json.decode(user!)["DepartmentID"];

                                                        final appConfig =
                                                            AppConfigProvider.of(context)?.appConfig;
                                                        final url = selectedOption == "own"
                                                            ? Uri.parse(
                                                            '${appConfig?.apiBaseUrl}/department/capital-and-recurrent/$dep')
                                                            : Uri.parse(
                                                            '${appConfig?.apiBaseUrl}/department/capital-and-recurrent');
                                                        final response = await http.get(
                                                          url,
                                                          headers: headers,
                                                        );
                                                        var data = json.decode(response.body);
                                              var models =
                                              BudgetHierarchy.fromJsonList(data);
                                              return models;
                                            },
                                          );
                                        }),
                                  ),
                                ],
                              ),
                            ),
                            Expanded(
                              child: Column(
                                children: [
                                  SizedBox(
                                    height: 100,
                                    child: Text(
                                      toDepartment,
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 20),
                                    ),
                                  ),
                                  Expanded(
                                    child: TreeViewComponent(
                                      type: 'capital',
                                      choiceSetter: setToDepartment,
                                      selectedOption: selectedOption,
                                      choices: toDepartment,
                                      description:
                                      "ወደ የመንግስት መ/ቤት / ፕሮግራም / የሥራ ክፍል",
                                      fetchFunction: () async {
                                        const secureStorage =
                                        FlutterSecureStorage();
                                        final token = await secureStorage.read(
                                            key: "token");
                                        final headers = {
                                          "Content-Type": "application/json",
                                          'Authorization': 'Bearer $token',
                                        };
                                        final user = await secureStorage.read(
                                            key: "user");
                                        final dep =
                                        json.decode(user!)["DepartmentID"];

                                        final appConfig =
                                            AppConfigProvider.of(context)
                                                ?.appConfig;
                                        final url = Uri.parse(
                                            '${appConfig?.apiBaseUrl}/department/capital-and-recurrent/$dep');
                                        final response = await http.get(
                                          url,
                                          headers: headers,
                                        );
                                        var data = json.decode(response.body);
                                        var models =
                                        BudgetHierarchy.fromJsonList(data);
                                        return models;
                                      },
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                Step2Widget(
                  formKey: _formKeyStep2,
                  content: GridView.builder(
                    shrinkWrap: true,
                    gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
                        maxCrossAxisExtent: 350,
                        crossAxisSpacing: 5.0,
                        mainAxisSpacing: 5.0,
                        mainAxisExtent: 340),
                    itemCount: transactions.length,
                    itemBuilder: (context, index) {
                      return Card(
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              DropDownOption(
                                setSelectedOption: (str) =>
                                    setFromCode(str, index),
                                selectedOption:
                                transactions[index]["fromCode"] as String,
                                description: "ከ በጀት ኮድ",
                                fetchFunction: (String filter) async {
                                  final appConfig =
                                      AppConfigProvider.of(context)?.appConfig;
                                  const secureStorage = FlutterSecureStorage();
                                  final token =
                                  await secureStorage.read(key: "token");
                                  final headers = {
                                    "Content-Type": "application/json",
                                    'Authorization': 'Bearer $token',
                                  };
                                  print('${appConfig?.apiBaseUrl}/budgetcode');
                                  final url = Uri.parse(
                                      '${appConfig?.apiBaseUrl}/budgetcode');
                                  final response = await http.get(
                                    url,
                                    headers: headers,
                                  );
                                  var data = json.decode(response.body);
                                  var models = BudgetCode.fromJsonList(data);
                                  return models
                                      .map((e) => "${e.id}: ${e.description}")
                                      .toList();
                                },
                              ),
                              DropDownOption(
                                setSelectedOption: (str) =>
                                    setToCode(str, index),
                                selectedOption:
                                transactions[index]["toCode"] as String,
                                description: "ወደ በጀት ኮድ",
                                fetchFunction: (String filter) async {
                                  final appConfig =
                                      AppConfigProvider.of(context)?.appConfig;
                                  const secureStorage = FlutterSecureStorage();
                                  final token =
                                  await secureStorage.read(key: "token");
                                  final headers = {
                                    "Content-Type": "application/json",
                                    'Authorization': 'Bearer $token',
                                  };
                                  print('${appConfig?.apiBaseUrl}/budgetcode');
                                  final url = Uri.parse(
                                      '${appConfig?.apiBaseUrl}/budgetcode');
                                  final response = await http.get(
                                    url,
                                    headers: headers,
                                  );
                                  var data = json.decode(response.body);
                                  var models = BudgetCode.fromJsonList(data);
                                  return models
                                      .map((e) => "${e.id}: ${e.description}")
                                      .toList();
                                },
                              ),
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 12.0),
                                child: TextField(
                                  keyboardType: TextInputType.numberWithOptions(
                                      decimal: true),
                                  // Enable decimal input
                                  inputFormatters: [
                                    FilteringTextInputFormatter.allow(
                                        RegExp(r'^\d+\.?\d{0,2}')),
                                    // Allow digits and up to 2 decimal places
                                  ],
                                  controller: controllers[index],
                                  onChanged: (val) =>
                                      setAmount(double.parse(val), index),
                                  decoration: InputDecoration(
                                    fillColor: Colors.white,
                                    filled: true,
                                    contentPadding: const EdgeInsets.only(
                                        right: 10, left: 10),
                                    border: OutlineInputBorder(
                                      borderSide: BorderSide(
                                          color: Colors.black, width: 1.0),
                                      borderRadius: BorderRadius.all(
                                        Radius.circular(10.0),
                                      ),
                                    ),
                                    focusedBorder: const OutlineInputBorder(
                                      borderSide: BorderSide(
                                          color: Colors.black, width: 1.0),
                                      borderRadius: BorderRadius.all(
                                        Radius.circular(10.0),
                                      ),
                                    ),
                                    enabledBorder: const OutlineInputBorder(
                                      borderSide: BorderSide(
                                          color: Colors.black, width: 1.0),
                                      borderRadius: BorderRadius.all(
                                        Radius.circular(10.0),
                                      ),
                                    ),
                                    errorBorder: OutlineInputBorder(
                                        borderSide: const BorderSide(
                                            width: 1, color: Colors.red),
                                        borderRadius: BorderRadius.circular(10)),
                                    labelText: 'ብር (መጠን)',
                                    hintText: 'የ ገንዘብ መጠን ያስገቡ።',
                                  ),
                                ),
                              ),
                              DropdownOrInputField(
                                index: index,
                                setReason: setReason,
                                initialvalue:
                                transactions[index]["reason"].toString(),
                              ),
                              Row(
                                mainAxisAlignment:
                                MainAxisAlignment.spaceBetween,
                                children: [
                                  if (index == transactions.length - 1 && (index != 6))
                                    ElevatedButton(
                                        onPressed: () {
                                          if(transactions.length < 7 ) {
                                            setState(() {
                                              transactions.add({
                                                "fromCode": "",
                                                "toCode": "",
                                                "reason": "",
                                                "amount": 0.0,
                                              });
                                              controllers
                                                  .add(TextEditingController());
                                            });
                                          }
                                        },
                                        style: ElevatedButton.styleFrom(
                                          shape: CircleBorder(),
                                          backgroundColor: Colors.green,
                                          padding: EdgeInsets.all(10),
                                        ),
                                        child: const Icon(
                                          Icons.add,
                                          color: Colors.white,
                                        )),
                                  ElevatedButton(
                                    onPressed: () => {
                                      setAmount(0.0, index),
                                      setState(() {
                                        transactions.removeAt(index);
                                        controllers.removeAt(index);
                                      })
                                    },
                                    style: ElevatedButton.styleFrom(
                                      shape: CircleBorder(),
                                      backgroundColor: Colors.red,
                                      padding: EdgeInsets.all(10),
                                    ),
                                    child: const Icon(
                                      Icons.delete,
                                      color: Colors.white,
                                      size: 25,
                                    ),
                                  )
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
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
                // Step 3
                Step3Widget(
                  formKey: _formKeyStep3,
                  content: Container(
                      width: double.infinity,
                      height: 600,
                      child: Center(
                        child: ListView.separated(
                          physics: BouncingScrollPhysics(),
                          shrinkWrap: true,
                          scrollDirection: Axis.horizontal,
                          itemCount: documents.length,
                          itemBuilder: (context, index) => DocumentCard(
                              fetchImages:fetchImages,
                              onPressed:onPressed,
                              index:index,
                              pictures: documents[index]
                          ),
                          separatorBuilder: (context, index) => SizedBox(
                            width: 10,
                          ),

                        ),
                      )
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
                )                // Step 4
                // Step4Widget(
                //   formKey: _formKeyStep4,
                //
                //   onPrevious: () {
                //     _pageController.previousPage(
                //       duration: const Duration(milliseconds: 500),
                //       curve: Curves.easeInOut,
                //     );
                //   },
                // ),
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
          children: [
            const Text('ከፈል 1'),
            Expanded(child: content),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                ElevatedButton(
                  onPressed: onNext,
                  child: const Text(
                    'ቀጥል',
                    style: TextStyle(color: Colors.white),
                  ),
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
            const Text('ክፈል 2'),
            Expanded(child: content),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ElevatedButton(
                  onPressed: onPrevious,
                  child: const Text(
                    'ቀዳሚ',
                    style: TextStyle(color: Colors.white),
                  ),
                ),
                ElevatedButton(
                  onPressed: onNext,
                  child: const Text(
                    'ቀጥል',
                    style: TextStyle(color: Colors.white),
                  ),
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
            const Text('ክፍል 3'),
            Expanded(child: content),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ElevatedButton(
                  onPressed: onPrevious,
                  child: const Text(
                    'ቀዳሚ',
                    style: TextStyle(color: Colors.white),
                  ),
                ),
                ElevatedButton(
                  onPressed: onNext,
                  child: const Text(
                    'ይመልከቱ',
                    style: TextStyle(color: Colors.white),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
