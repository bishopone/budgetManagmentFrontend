import 'dart:convert';

import 'package:budgetmanager/helpers/widgets/my_container.dart';
import 'package:budgetmanager/helpers/widgets/my_spacing.dart';
import 'package:budgetmanager/helpers/widgets/my_text.dart';
import 'package:budgetmanager/helpers/widgets/my_text_style.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

import 'package:budgetmanager/helpers/theme/app_theme.dart';

import '../config.dart';

class HealthProfileScreen extends StatefulWidget {
  @override
  _HealthProfileScreenState createState() => _HealthProfileScreenState();
}

class _HealthProfileScreenState extends State<HealthProfileScreen> {
  late CustomTheme customTheme;
  late ThemeData theme;

  @override
  void initState() {
    super.initState();
    customTheme = AppTheme.customTheme;
    theme = AppTheme.theme;
  }

  int selectedDate = 1;

  Future<Map<String, dynamic>?> getUserStorage() async {
    final storage = FlutterSecureStorage();
    try {
      final user = await storage.read(key: 'user');
      if (user == null) {
        return null; // Handle the error as needed
      }
      final decodeduser = jsonDecode(user);
      print(decodeduser['ProfilePictureLink']);
      return decodeduser;
    } catch (e) {
      print('Error retrieving username: $e');
      return null; // Handle the error as needed
    }
  }

  @override
  Widget build(BuildContext context) {
    final appConfig = AppConfigProvider.of(context)?.appConfig;
    return Scaffold(
        body: FutureBuilder<Map<String, dynamic>?>(
            future: getUserStorage(),
            builder: (context, snapshot) {
              if (snapshot.data == null) {
                return Center(
                    child: Column(
                      children: [
                        const Text("Somthing went wrong "),
                        TextButton(
                            onPressed: () =>
                                Navigator.pushReplacementNamed(
                                    context, '/auth'),
                            child: const Text("Try to Login Again "))
                      ],
                    ));
              }
              else if (snapshot.data != null) {
                return ListView(
                  padding: MySpacing.top(MySpacing.safeAreaTop(context) + 20),
                  children: [
                    MyContainer.bordered(
                      padding: MySpacing.vertical(24),
                      margin: MySpacing.fromLTRB(24, 16, 24, 0),
                      borderRadiusAll: 4,
                      child: Column(
                        children: [
                          Container(
                            margin: MySpacing.fromLTRB(24, 0, 24, 0),
                            alignment: Alignment.center,
                            child: ClipRRect(
                              borderRadius: BorderRadius.all(
                                  Radius.circular(8)),
                              child:  Image(
                                image: NetworkImage("${appConfig?.apiBaseUrl}/${snapshot.data?["ProfilePictureLink"]?.toString() ?? ""}"
                                  ,
                                ),
                                width: 100,
                                height: 100,
                                fit: BoxFit.cover,
                                errorBuilder: (BuildContext context, Object error, StackTrace? stackTrace) {
                                  // If there's an error loading the network image, use a local fallback image
                                  return Image.asset(
                                    "assets/profile.jpg",
                                    width: 100,
                                    height: 100,
                                    fit: BoxFit.cover,
                                  );
                                },
                              ),
                            ),
                          ),
                          Container(
                            margin: MySpacing.top(16),
                            child: MyText.bodyLarge(snapshot
                                .data!["Username"],
                                fontWeight: 600, letterSpacing: 0),
                          ),
                          Container(
                            margin: MySpacing.top(24),
                            child: Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    children: [
                                      MyText.bodySmall("Department",
                                          color: theme.colorScheme.primary,
                                          muted: true),
                                      RichText(
                                        text: TextSpan(children: <TextSpan>[
                                          TextSpan(
                                              text: "Dep.",
                                              style: MyTextStyle.bodyLarge(
                                                  color: theme.colorScheme
                                                      .onBackground,
                                                  fontWeight: 600)),
                                          TextSpan(
                                              text: snapshot
                                                  .data!["DepartmentID"]
                                                  .toString(),
                                              style: MyTextStyle.bodyMedium(
                                                  color: theme.colorScheme
                                                      .onBackground,
                                                  fontWeight: 500)),
                                        ]),
                                      )
                                    ],
                                  ),
                                ),
                                Expanded(
                                  child: Column(
                                    children: [
                                      MyText.bodySmall("Gender",
                                          color: theme.colorScheme.primary,
                                          muted: true),
                                      RichText(
                                        text: TextSpan(children: <TextSpan>[
                                          TextSpan(
                                              text: snapshot.data!["Gender"],
                                              style: MyTextStyle.bodyLarge(
                                                  color: theme.colorScheme
                                                      .onBackground,
                                                  fontWeight: 600)),
                                          TextSpan(
                                              text: "",
                                              style: MyTextStyle.bodyMedium(
                                                  color: theme.colorScheme
                                                      .onBackground,
                                                  fontWeight: 500)),
                                        ]),
                                      )
                                    ],
                                  ),
                                ),
                                Expanded(
                                  child: Column(
                                    children: [
                                      MyText.bodySmall("PhoneNumber",
                                          color: theme.colorScheme.primary,
                                          muted: true),
                                      RichText(
                                        text: TextSpan(children: <TextSpan>[
                                          TextSpan(
                                              text: snapshot
                                                  .data!["PhoneNumber"],
                                              style: MyTextStyle.bodyLarge(
                                                  color: customTheme.colorInfo,
                                                  fontWeight: 600)),
                                          TextSpan(
                                              text: "",
                                              style: MyTextStyle.bodyMedium(
                                                  color: customTheme.colorInfo,
                                                  fontWeight: 500)),
                                        ]),
                                      )
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                    Container(
                      margin: MySpacing.fromLTRB(24, 20, 24, 0),
                      child: MyText.bodySmall(
                        "Settings".toUpperCase(),
                        fontSize: 11.8,
                        fontWeight: 600,
                        xMuted: true,
                      ),
                    ),
                    Container(
                      margin: MySpacing.fromLTRB(24, 20, 24, 0),
                      child: Column(
                        children: [
                        settingsWidget(
                        docName: "Profile Setting",
                        icon: Icons.person,
                        action: () async {
                          Navigator.pushNamed(context, '/profilesetting');
                        },),
                        Container(
                          margin: MySpacing.top(8),
                          child: settingsWidget(
                            docName: "Log Out",
                            icon: Icons.settings,
                            action: () async {
                              print("logout");
                              final secureStorage = await FlutterSecureStorage();
                              secureStorage.deleteAll();
                              Navigator.pushReplacementNamed(context, '/auth');
                            },)
                        ),
                        ],
                      ),
                    )
                  ],
                );
              }
              return LoadingAnimationWidget.fourRotatingDots(
                color: Colors.lightBlueAccent,
                size: 40,
              );
            }
        ));
  }

  Widget settingsWidget({
    required String docName,
    required IconData icon,
    required VoidCallback action,
  }) {
    return InkWell(
      onTap: action,
      child: MyContainer(
        padding: MySpacing.fromLTRB(16,8,8,8),
        borderRadiusAll: 4,
        child: Row(
          children: [
            Icon(icon),
            Expanded(
              child: Container(
                height: 50,
                margin: MySpacing.left(16),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    MyText.bodyMedium(docName,
                        color: theme.colorScheme.onBackground, fontWeight: 600),
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
