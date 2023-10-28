import 'package:flutter/material.dart';

class AppConfig {
  final String apiBaseUrl;

  AppConfig({required this.apiBaseUrl});

  factory AppConfig.dev() {
    return AppConfig(apiBaseUrl: 'http://10.0.2.2:5000');
  }

  factory AppConfig.staging() {
    return AppConfig(apiBaseUrl: 'http://192.168.42.199:5000');
  }

  factory AppConfig.production() {
    return AppConfig(apiBaseUrl: 'http://172.105.249.195:5000');
  }
}


class AppConfigProvider extends InheritedWidget {
  final AppConfig appConfig;

  AppConfigProvider({
    required this.appConfig,
    required Widget child,
  }) : super(child: child);

  static AppConfigProvider? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<AppConfigProvider>();
  }

  @override
  bool updateShouldNotify(covariant InheritedWidget oldWidget) => false;
}
