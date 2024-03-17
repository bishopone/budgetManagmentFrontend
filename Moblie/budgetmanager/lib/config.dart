import 'package:flutter/material.dart';
import 'dart:io';

class AppConfig {
  final String apiBaseUrl;

  AppConfig({required this.apiBaseUrl});

  factory AppConfig.dev() {
    if(Platform.isWindows) {
      return AppConfig(apiBaseUrl: 'http://localhost:5000/api');
    }
    if(Platform.isAndroid) {
      return AppConfig(apiBaseUrl: 'http://192.168.42.145:5000/api');
    }
    else{
      return AppConfig(apiBaseUrl: 'http://localhost:5000/api');
    }
  }

  factory AppConfig.staging() {
    return AppConfig(apiBaseUrl: 'http://192.168.42.145:5000/api');
  }
  factory AppConfig.production() {
    return AppConfig(apiBaseUrl: 'https://api.finance.aboldevelopers.com/api');
  }
  factory AppConfig.wifi() {
    return AppConfig(apiBaseUrl: 'http://192.168.42.154:5000');
  }
  factory AppConfig.wifiwin() {
    return AppConfig(apiBaseUrl: 'https://localhost:5000');
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
