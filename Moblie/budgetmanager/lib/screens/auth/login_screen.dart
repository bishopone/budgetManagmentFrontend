/*
* File : Login
* Version : 1.0.0
* */

import 'dart:convert';
import 'dart:io';

import 'package:budgetmanager/helpers/theme/app_theme.dart';
import 'package:budgetmanager/helpers/widgets/my_button.dart';
import 'package:budgetmanager/helpers/widgets/my_container.dart';
import 'package:budgetmanager/helpers/widgets/my_spacing.dart';
import 'package:budgetmanager/helpers/widgets/my_text.dart';
import 'package:budgetmanager/helpers/widgets/my_text_style.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:lucide_icons/lucide_icons.dart';
import 'package:device_info_plus/device_info_plus.dart';

import '../../config.dart';
import '../../helpers/widgets/my_popups.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();
  bool _passwordVisible = false;
  bool loading = false;
  late CustomTheme customTheme;
  late ThemeData theme;
  String phoneNumber = "";
  TextEditingController phoneNumberController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  String phoneNumberError = ''; // Error message for phone number
  String passwordError = ''; // Error message for password
  var devicedata ;
  FocusNode _field1FocusNode = FocusNode();
  FocusNode _field2FocusNode = FocusNode();
  @override
  void dispose() {
    // Dispose the FocusNodes to free up resources
    _field1FocusNode.dispose();
    _field2FocusNode.dispose();
    super.dispose();
  }
  Future<void> loginUser(String phoneNumber, String password) async {
    final phoneNumber = phoneNumberController.text;
    final password = passwordController.text;

    // Validate phone number and password
    final isPhoneNumberValid = validatePhoneNumber(phoneNumber);
    final isPasswordValid = validatePassword(password);

    // If either field is invalid, do not proceed with login
    if (!isPhoneNumberValid || !isPasswordValid) {
      setState(() {});
      return;
    }
    setState(() {
      loading = true;
      showLoadingDialog(context);
    });
    final appConfig = AppConfigProvider.of(context)?.appConfig;
    print('${appConfig?.apiBaseUrl}/users/login');
    final url = Uri.parse('${appConfig?.apiBaseUrl}/users/login');
    print(devicedata);
    final body = {"Password": password, "PhoneNumber": phoneNumber, "device": devicedata?.data?["deviceId"].toString().replaceAll("{", "").replaceAll("}", ""), "platform":Platform.isWindows ? "Windows" : "Android" };

    try {
      print("response");
      final response = await http.post(
        url,
        body: json.encode(body),
        headers: {"Content-Type": "application/json"},
      );
      print(response.body);
      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);

        if(!(responseData['user']['UserType'] == 2) && !(responseData['user']['UserType'] == 3) ){
          setState(() {
            loading = false;
            Navigator.of(context, rootNavigator: true).pop();
            showErrorDialog(context, "only Planner and Manager are allowed to use this app!!", ()=>Navigator.of(context).pop());
          });
          return;
        }
        const secureStorage = FlutterSecureStorage();

        await secureStorage.write(key: 'token', value: responseData['token']);
        await secureStorage.write(
            key: 'user', value: json.encode(responseData['user']));
        await secureStorage.write(
            key: 'permissions', value: json.encode(responseData['permissions']));
        await secureStorage.write(key: 'phone-number', value: responseData['phone-number']);
        Navigator.of(context, rootNavigator: true).pop();
        showSuccessDialog(context);
        final token = await secureStorage.read(key: 'notificationtoken');
        setState(() {
          loading = false;
          Navigator.of(context, rootNavigator: true).pop();
          Navigator.pushReplacementNamed(context, "/home");
        });
        await registerNotificationToken(token);
      } else {
        final errorMessage = json.decode(response.body)['message'];
        print(errorMessage);
        setState(() {
          loading = false;
          Navigator.of(context, rootNavigator: true).pop();

          showErrorDialog(context, errorMessage, ()=>Navigator.of(context).pop());
        });
      }
    } catch (error) {
      setState(() {
        loading = false;
        Navigator.of(context, rootNavigator: true).pop();
        showErrorDialog(context, "Something is wrong please try again. ", ()=>Navigator.of(context).pop());
      });
    }
  }
  Future<void> registerNotificationToken(String? currentToken) async {
    final appConfig = AppConfigProvider.of(context)?.appConfig;
    const storage = FlutterSecureStorage();
    final token = await storage.read(key: 'token');
    print(token);
    print(currentToken);
    final url = Uri.parse('${appConfig?.apiBaseUrl}/notification/register');
    final headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };

    final body = {
      'token': currentToken,
    };

    try {
      final response = await http.post(
        url,
        headers: headers,
        body: jsonEncode(body),
      );

      if (response.statusCode == 200) {
        // Registration was successful
      } else {
        // Handle the error (e.g., registration failed)
      }
    } catch (error) {
      // Handle network or other errors
    }
  }

  bool validatePhoneNumber(String phoneNumber) {
    if (phoneNumber.isEmpty) {
      phoneNumberError = 'Phone number cannot be empty';
      return false;
    } else if (phoneNumber.length != 10 || !phoneNumber.startsWith('09')) {
      phoneNumberError = 'Invalid phone number format';
      return false;
    }
    phoneNumberError = ''; // Reset error message
    return true;
  }
  // Validation function for password
  bool validatePassword(String password) {
    if (password.isEmpty) {
      passwordError = 'Password cannot be empty';
      return false;
    } else if (password.length <= 4) {
      passwordError = 'Password must be more than 4 characters';
      return false;
    }
    passwordError = ''; // Reset error message
    return true;
  }
  @override
  void initState() {
    super.initState();
    phoneNumberSetter();
    customTheme = AppTheme.customTheme;
    theme = AppTheme.theme;
  }

  Future<void> phoneNumberSetter() async {
    const secureStorage = FlutterSecureStorage();
    phoneNumber = await secureStorage.read(key: "phone-number") ?? "";
    print(phoneNumber);
    phoneNumberController.text = phoneNumber;
    devicedata = await deviceInfo.deviceInfo;

  }

    @override
  Widget build(BuildContext context) {
    // print(devicedata.data["deviceId"]);
      return Scaffold(
      body: ListView(
        padding: const EdgeInsets.all(8),
        children: <Widget>[
          SizedBox(
            width: 400,
            height: MediaQuery.of(context).size.height * 3 / 10,
            child: Stack(
              children: <Widget>[
                Container(
                  decoration: BoxDecoration(
                      color: theme.colorScheme.background,
                      borderRadius:
                          const BorderRadius.only(bottomLeft: Radius.circular(96))),
                ),
                Positioned(
                  bottom: 20,
                  right: 50,
                  left: 50,
                  child: MyText.displayLarge("LOGIN", fontWeight: 1000,textAlign: TextAlign.center,),
                )
              ],
            ),
          ),
          Container(
            margin: const EdgeInsets.only(left: 20, right: 20, top: 20),
            child: Center(
              child: MyContainer.bordered(
                width: 400,
                padding:
                    const EdgeInsets.only(top: 12, left: 20, right: 20, bottom: 12),
                child: Column(
                  children: <Widget>[
                    TextFormField(
                      focusNode: _field1FocusNode,
                      keyboardType: TextInputType.number,
                      controller: phoneNumberController, // Assign controller for phone number
                      style: MyTextStyle.bodyLarge(
                        letterSpacing: 0.1,
                        color: theme.colorScheme.onBackground,
                        fontWeight: 500,
                      ),
                      onEditingComplete: () {
                        // Move focus to the next field when Enter is pressed
                        FocusScope.of(context).requestFocus(_field2FocusNode);
                      },
                      decoration: InputDecoration(
                        hintText: "Phone Number",
                        hintStyle: MyTextStyle.titleSmall(
                          letterSpacing: 0.1,
                          color: theme.colorScheme.onBackground,
                          fontWeight: 500,
                        ),
                        errorText: phoneNumberError.isNotEmpty ? phoneNumberError : null,
                        prefixIcon: const Icon(LucideIcons.phone),
                      ),
                    ),
                    Container(
                      margin: const EdgeInsets.only(top: 20),
                      child: TextFormField(
                        controller: passwordController, // Assign controller for password
                        style: MyTextStyle.bodyLarge(
                          letterSpacing: 0.1,
                          color: theme.colorScheme.onBackground,
                          fontWeight: 500,
                        ),
                        focusNode: _field2FocusNode,
                        onEditingComplete: () {
                          // Move focus to the next field when Enter is pressed
                          loginUser(phoneNumberController.text, passwordController.text);
                          },
                        decoration: InputDecoration(
                          hintText: "Password",
                          hintStyle: MyTextStyle.titleSmall(
                            letterSpacing: 0.1,
                            color: theme.colorScheme.onBackground,
                            fontWeight: 500,
                          ),
                          errorText: passwordError.isNotEmpty ? passwordError : null,
                          prefixIcon: const Icon(LucideIcons.lock),
                          suffixIcon: IconButton(
                            icon: Icon(_passwordVisible
                                ? LucideIcons.eye
                                : LucideIcons.eyeOff),
                            onPressed: () {
                              setState(() {
                                // Toggle password visibility
                                _passwordVisible = !_passwordVisible;
                              });
                            },
                          ),
                        ),
                        obscureText: !_passwordVisible, // Invert the value for obscureText
                      ),
                    ),
                    Container(
                      margin: const EdgeInsets.only(top: 20),
                      alignment: Alignment.centerRight,
                      child:
                          MyText.bodySmall("Forgot Password ?", fontWeight: 500),
                    ),
                    Container(
                      margin: const EdgeInsets.only(top: 20),
                      child: MyButton(
                          elevation: 0,
                          borderRadiusAll: 4,
                          padding: MySpacing.xy(20, 20),
                          onPressed: () => loginUser(phoneNumberController.text, passwordController.text),
                          child: MyText.labelMedium("LOGIN",
                              fontWeight: 600,
                              color: theme.colorScheme.onPrimary,
                              letterSpacing: 0.5)),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
