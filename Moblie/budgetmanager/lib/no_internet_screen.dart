import 'package:budgetmanager/helpers/theme/app_theme.dart';
import 'package:budgetmanager/helpers/widgets/my_button.dart';
import 'package:budgetmanager/helpers/widgets/my_spacing.dart';
import 'package:budgetmanager/helpers/widgets/my_text.dart';
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class NoInternetScreen extends StatefulWidget {
  @override
  _NoInternetScreenState createState() => _NoInternetScreenState();
}

class _NoInternetScreenState extends State<NoInternetScreen> {
  late CustomTheme customTheme;
  late ThemeData theme;

  @override
  void initState() {
    super.initState();
    customTheme = AppTheme.customTheme;
    theme = AppTheme.theme;
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Icon(
                  LucideIcons.wifiOff,
                  size: 64,
                  color: theme.colorScheme.primary,
                ),
                Container(
                  margin: const EdgeInsets.only(top: 24),
                  child: MyText.titleLarge("Whoops",
                      color: theme.colorScheme.onBackground,
                      fontWeight: 600,
                      letterSpacing: 0.2),
                ),
                Container(
                  margin: const EdgeInsets.only(top: 24),
                  child: Column(
                    children: <Widget>[
                      MyText.bodyLarge(
                        "Slow or no internet connection",
                        letterSpacing: 0,
                        fontWeight: 500,
                        textAlign: TextAlign.center,
                      ),
                      Container(
                        margin: const EdgeInsets.only(top: 4),
                        child: MyText.bodyLarge(
                          "Please check your internet settings",
                          letterSpacing: 0,
                          fontWeight: 500,
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  margin: const EdgeInsets.only(top: 24),
                  child: MyButton(
                      elevation: 0,
                      borderRadiusAll: 4,
                      onPressed: () {Navigator.pushReplacementNamed(context, "/");},
                      padding: MySpacing.xy(16, 12),
                      child: MyText.labelMedium("Try again",
                          fontWeight: 600,
                          color: theme.colorScheme.onPrimary,
                          letterSpacing: 0.5)),
                ),
              ],
            ),
          )),
    );
  }
}
