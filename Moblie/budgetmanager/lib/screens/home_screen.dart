import 'dart:convert';

import 'package:budgetmanager/helpers/theme/app_theme.dart';
import 'package:budgetmanager/helpers/widgets/my_container.dart';
import 'package:budgetmanager/helpers/widgets/my_spacing.dart';
import 'package:budgetmanager/helpers/widgets/my_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../config.dart';

class HealthHomeScreen extends StatefulWidget {
  @override
  _HealthHomeScreenState createState() => _HealthHomeScreenState();
}

class _HealthHomeScreenState extends State<HealthHomeScreen> {
  late CustomTheme customTheme;
  late ThemeData theme;

  @override
  void initState() {
    super.initState();
    customTheme = AppTheme.customTheme;
    theme = AppTheme.theme;
  }

  Future<Map<String, dynamic>?> getUserStorage() async {
    final storage = FlutterSecureStorage();
    try {
      final user = await storage.read(key: 'user');
      if (user == null) {
        return null; // Handle the error as needed
      }
      final decodeduser = jsonDecode(user);
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
                            Navigator.pushReplacementNamed(context, '/auth'),
                        child: const Text("Try to Login Again "))
                  ],
                ));
              } else if (snapshot.data != null) {
                print(snapshot.data);

                return Column(
                  // padding: MySpacing.top(48),
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Container(
                      margin: MySpacing.fromLTRB(24, 0, 24, 0),
                      alignment: Alignment.center,
                      child: ClipRRect(
                        borderRadius: BorderRadius.all(Radius.circular(8)),
                        child: Image(
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
                      margin: MySpacing.fromLTRB(24, 16, 24, 0),
                      child: MyText.titleMedium("Hello",
                          xMuted: true, color: theme.colorScheme.onBackground),
                    ),
                    Container(
                      margin: MySpacing.fromLTRB(24, 16, 24, 0),
                      child: MyText.headlineMedium(
                          snapshot.data!["Username"].toString(),
                          letterSpacing: -0.5,
                          color: theme.colorScheme.onBackground,
                          fontWeight: 700),
                    ),
                    Container(
                      margin: MySpacing.fromLTRB(24, 24, 24, 0),
                      child: MyText.titleMedium("How can i help you today?",
                          letterSpacing: -0.15,
                          color: theme.colorScheme.onBackground,
                          fontWeight: 600,
                          muted: true),
                    ),
                    if(snapshot.data!['UserType'] == 2)
                    Container(
                      margin: MySpacing.top(24),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          InkWell(
                            onTap: () =>
                                Navigator.pushNamed(context, "/normalbudget"),
                            child: singleHelpWidget(
                                iconData: LucideIcons.badgeDollarSign,
                                title: "መደበኛ በጀት"),
                          ),
                          InkWell(
                            onTap: () =>
                                Navigator.pushNamed(context, "/capitalbudget"),
                            child: singleHelpWidget(
                                iconData: LucideIcons.landmark,
                                title: "ካፒታል በጀት"),
                          ),
                        ],
                      ),
                    ),
                    if(snapshot.data!['UserType'] == 2)
                      Container(
                      margin: MySpacing.top(24),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          InkWell(
                            onTap: () =>
                                Navigator.pushNamed(context, "/safebudget"),
                            child: singleHelpWidget(
                                iconData: LucideIcons.piggyBank,
                                title: "መጠባበቅያ በጀት"),
                          ),
                          InkWell(
                            onTap: () => {},
                            child: SizedBox( width: (MediaQuery.of(context).size.width - 96) / 3,
                              height: 10,)

                            // onTap: () =>
                            //     Navigator.pushNamed(context, "/insiderbudget"),
                            // child: singleHelpWidget(
                            //     iconData: LucideIcons.wallet2, title: "ውስጠ ገቢ"),
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              } else {
                return Center(
                  child: LoadingAnimationWidget.fourRotatingDots(
                    color: Colors.lightBlueAccent,
                    size: 40,
                  ),
                );
              }
            }));
  }

  Widget singleHelpWidget(
      {IconData? iconData, required String title, Color? color}) {
    return MyContainer(
      width: (MediaQuery.of(context).size.width - 96) / 3,
      padding: MySpacing.fromLTRB(0, 20, 0, 20),
      borderRadiusAll: 4,
      child: Column(
        children: [
          Icon(
            iconData,
            color: color ?? theme.colorScheme.primary,
            size: 30,
          ),
          Container(
            margin: MySpacing.top(8),
            child: MyText.bodySmall(title,
                letterSpacing: 0,
                color: theme.colorScheme.onBackground,
                fontWeight: 600),
          )
        ],
      ),
    );
  }
}
