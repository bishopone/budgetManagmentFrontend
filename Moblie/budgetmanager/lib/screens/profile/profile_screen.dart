import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:file_picker/file_picker.dart';

import '../../config.dart';
import '../../helpers/widgets/my_container.dart';
import '../../helpers/widgets/my_spacing.dart';

class ProfileSetting extends StatefulWidget {
  @override
  _ProfileSettingState createState() => _ProfileSettingState();
}

class _ProfileSettingState extends State<ProfileSetting> {
  final GlobalKey<FormBuilderState> _fbKey = GlobalKey<FormBuilderState>();
  late Future<Map<String, dynamic>> initialUserData;
  TextEditingController passwordController = TextEditingController();
  TextEditingController verifyPasswordController = TextEditingController();
  List<PlatformFile>? _pickedFiles;

  @override
  void initState() {
    super.initState();
    initialUserData = _fetchUserData();
  }

  Future<Map<String, dynamic>> _fetchUserData() async {
    try {
      const secureStorage = FlutterSecureStorage();
      final token = await secureStorage.read(key: "token");
      final user = await secureStorage.read(key: "user");
      final decodeduser = jsonDecode(user!);
      final appConfig = AppConfigProvider.of(context)?.appConfig;
      final response = await http.get(
        Uri.parse('${appConfig?.apiBaseUrl}/users/${decodeduser["UserID"]}'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        // Successful GET request
        print("json.decode(response.body)");
        print(json.decode(response.body));
        return json.decode(response.body);
      } else {
        // Handle error response
        print('Error: ${response.reasonPhrase}');
        throw Exception('Failed to fetch user data');
      }
    } catch (error) {
      // Handle request error
      print('Error: $error');
      throw Exception('Failed to fetch user data');
    }
  }

  Future<void> _pickFile() async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.image,
        allowMultiple: false,
      );

      if (result != null && result.files.isNotEmpty) {
        setState(() {
          _pickedFiles = result.files;
        });
      }
    } catch (e) {
      print('Error picking file: $e');
    }
  }

  void _submitForm() async {
    if (_fbKey.currentState?.saveAndValidate() ?? false) {
      Map<String, dynamic> formData = _fbKey.currentState!.value;

      // Perform manual validation
      if (formData['Password'] != formData['VerifyPassword']) {
        // Passwords do not match
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Passwords do not match'),
            backgroundColor: Colors.red,
          ),
        );
        return;
      }

      // Use formData to send a PUT request to your API
      try {
        const secureStorage = FlutterSecureStorage();
        final token = await secureStorage.read(key: "token");
        final user = await secureStorage.read(key: "user");
        final decodeduser = jsonDecode(user!);
        final appConfig = AppConfigProvider.of(context)?.appConfig;

        // Create a MultipartRequest
        var uri = Uri.parse(
            '${appConfig?.apiBaseUrl}/users/${decodeduser["UserID"]}');
        var request = http.MultipartRequest('PUT', uri)
          ..headers['Authorization'] = 'Bearer $token';

        // Add form fields
        formData.forEach((key, value) {
          request.fields[key] = value.toString();
        });

        // Handle the image file
        if (_pickedFiles != null && _pickedFiles!.isNotEmpty) {
          var addDt = DateTime.now();
          request.files.add(await http.MultipartFile.fromPath(
            'profile',
            _pickedFiles![0].path ?? '',
            filename: 'profile_${addDt.microsecondsSinceEpoch}',
          ));
        }

        // Send the request
        var response = await request.send();
        if (response.statusCode == 201) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Updated profile successfully'),
              backgroundColor: Colors.green,
            ),
          );
        } else {
          // Handle error response
          print('Error: ${response.reasonPhrase}');
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Error: ${response.reasonPhrase}'),
              backgroundColor: Colors.red,
            ),
          );
        }
      } catch (error) {
        // Handle request error
        print(error);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $error'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text(
          "መረጃ መቀየርያ",
          style: TextStyle(color: Colors.black),
        ),
      ),
      body: FutureBuilder<Map<String, dynamic>>(
        future: initialUserData,
        builder: (context, snapshot) {
          print(snapshot.data);
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else {
            return _buildForm(snapshot.data!);
          }
        },
      ),
    );
  }

  Widget _buildForm(Map<String, dynamic> userData) {
    final appConfig = AppConfigProvider.of(context)?.appConfig;

    print(userData);
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: FormBuilder(
        key: _fbKey,
        autovalidateMode: AutovalidateMode.onUserInteraction,
        initialValue: userData,
        child: Center(
          child: MyContainer.bordered(
            padding: MySpacing.vertical(24),
            margin: MySpacing.fromLTRB(24, 16, 24, 0),
            borderRadiusAll: 4,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Expanded(
                  child: Column(
                    children: [
                      Container(
                        margin: MySpacing.fromLTRB(24, 0, 24, 0),
                        alignment: Alignment.center,
                        child: Stack(
                          children: [
                            ClipRRect(
                              borderRadius:
                                  BorderRadius.all(Radius.circular(8)),
                              child: _pickedFiles != null &&
                                      _pickedFiles!.isNotEmpty
                                  ? Image.file(
                                      File(_pickedFiles![0].path ?? ""),
                                      width: 500,
                                      height: 500,
                                      fit: BoxFit.cover,
                                      errorBuilder: (BuildContext context,
                                          Object error,
                                          StackTrace? stackTrace) {
                                        return Image.asset(
                                          "assets/profile.jpg",
                                          width: 100,
                                          height: 100,
                                          fit: BoxFit.cover,
                                        );
                                      },
                                    )
                                  : Image.network(
                                      "${appConfig?.apiBaseUrl}/${userData['ProfilePictureLink'] ?? ""}",
                                      width: 500,
                                      height: 500,
                                      fit: BoxFit.cover,
                                      errorBuilder: (BuildContext context,
                                          Object error,
                                          StackTrace? stackTrace) {
                                        return Image.asset(
                                          "assets/profile.jpg",
                                          width: 100,
                                          height: 100,
                                          fit: BoxFit.cover,
                                        );
                                      },
                                    ),
                            ),
                            Positioned(
                                top: 0, left: 0, child: _buildFileSelection())
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      FormBuilderTextField(
                        name: 'Username',
                        decoration: InputDecoration(
                            fillColor: Colors.white,
                            filled: true,
                            contentPadding:
                                const EdgeInsets.only(right: 10, left: 10),
                            border: OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 1.0),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10.0),
                              ),
                            ),
                            focusedBorder: const OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 1.0),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10.0),
                              ),
                            ),
                            enabledBorder: const OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 1.0),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10.0),
                              ),
                            ),
                            errorBorder: OutlineInputBorder(
                                borderSide: const BorderSide(
                                    width: 1, color: Colors.red),
                                borderRadius: BorderRadius.circular(10)),
                            labelText: 'Username'),
                      ),
                      FormBuilderTextField(
                        name: 'Password',
                        decoration: InputDecoration(
                            fillColor: Colors.white,
                            filled: true,
                            contentPadding:
                                const EdgeInsets.only(right: 10, left: 10),
                            border: OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 1.0),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10.0),
                              ),
                            ),
                            focusedBorder: const OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 1.0),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10.0),
                              ),
                            ),
                            enabledBorder: const OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 1.0),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10.0),
                              ),
                            ),
                            errorBorder: OutlineInputBorder(
                                borderSide: const BorderSide(
                                    width: 1, color: Colors.red),
                                borderRadius: BorderRadius.circular(10)),
                            labelText: 'Password'),
                        obscureText: true,
                        controller: passwordController,
                      ),
                      FormBuilderTextField(
                        name: 'VerifyPassword',
                        decoration: InputDecoration(
                            fillColor: Colors.white,
                            filled: true,
                            contentPadding:
                                const EdgeInsets.only(right: 10, left: 10),
                            border: OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 1.0),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10.0),
                              ),
                            ),
                            focusedBorder: const OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 1.0),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10.0),
                              ),
                            ),
                            enabledBorder: const OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 1.0),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10.0),
                              ),
                            ),
                            errorBorder: OutlineInputBorder(
                                borderSide: const BorderSide(
                                    width: 1, color: Colors.red),
                                borderRadius: BorderRadius.circular(10)),
                            labelText: 'Verify Password'),
                        validator: (value) {
                          if (value != passwordController.text) {
                            return 'Passwords do not match';
                          }
                          return null;
                        },
                        obscureText: true,
                        controller: verifyPasswordController,
                      ),
                      FormBuilderTextField(
                        name: 'Email',
                        decoration: InputDecoration(
                            fillColor: Colors.white,
                            filled: true,
                            contentPadding:
                                const EdgeInsets.only(right: 10, left: 10),
                            border: OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 1.0),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10.0),
                              ),
                            ),
                            focusedBorder: const OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 1.0),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10.0),
                              ),
                            ),
                            enabledBorder: const OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 1.0),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10.0),
                              ),
                            ),
                            errorBorder: OutlineInputBorder(
                                borderSide: const BorderSide(
                                    width: 1, color: Colors.red),
                                borderRadius: BorderRadius.circular(10)),
                            labelText: 'Email'),
                        validator: (value) {
                          if (value == null) {
                            return "Email can not be empty";
                          }
                          if (value.isEmpty) {
                            return 'Email is required';
                          }
                          // Add additional email validation if needed
                          return null;
                        },
                      ),
                      FormBuilderDropdown(
                        name: 'Gender',
                        decoration: InputDecoration(
                            fillColor: Colors.white,
                            filled: true,
                            contentPadding:
                                const EdgeInsets.only(right: 10, left: 10),
                            border: OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 1.0),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10.0),
                              ),
                            ),
                            focusedBorder: const OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 1.0),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10.0),
                              ),
                            ),
                            enabledBorder: const OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 1.0),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10.0),
                              ),
                            ),
                            errorBorder: OutlineInputBorder(
                                borderSide: const BorderSide(
                                    width: 1, color: Colors.red),
                                borderRadius: BorderRadius.circular(10)),
                            labelText: 'Gender'),
                        items: ['Male', 'Female']
                            .map((gender) => DropdownMenuItem(
                                  value: gender,
                                  child: Text(gender),
                                ))
                            .toList(),
                      ),
                      FormBuilderTextField(
                        name: 'PhoneNumber',
                        decoration: InputDecoration(
                            fillColor: Colors.white,
                            filled: true,
                            contentPadding:
                                const EdgeInsets.only(right: 10, left: 10),
                            border: OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 1.0),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10.0),
                              ),
                            ),
                            focusedBorder: const OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 1.0),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10.0),
                              ),
                            ),
                            enabledBorder: const OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: Colors.black, width: 1.0),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10.0),
                              ),
                            ),
                            errorBorder: OutlineInputBorder(
                                borderSide: const BorderSide(
                                    width: 1, color: Colors.red),
                                borderRadius: BorderRadius.circular(10)),
                            labelText: 'Phone Number'),
                      ),
                      SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: _submitForm,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          padding: EdgeInsets.all(20),
                        ),
                        child: Text('Submit',style: TextStyle(color: Colors.white)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFileSelection() {
    return Column(
      children: [
        IconButton(
          onPressed: _pickFile,
          icon: Icon(Icons.edit),
        ),
        SizedBox(height: 10),
      ],
    );
  }
}
