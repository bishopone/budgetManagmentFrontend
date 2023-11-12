import 'dart:convert';

import 'package:awesome_notifications/awesome_notifications.dart';
import 'package:budgetmanager/no_internet_screen.dart';
import 'package:budgetmanager/screens/auth/login_screen.dart';
import 'package:budgetmanager/screens/budget/capital_budget.dart';
import 'package:budgetmanager/screens/budget/insider_budget.dart';
import 'package:budgetmanager/screens/budget/normal_budget.dart';
import 'package:budgetmanager/screens/budget/safe_budget.dart';
import 'package:budgetmanager/screens/information/information_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:im_animations/im_animations.dart';
import 'package:provider/provider.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

import 'config.dart';
import 'helpers/theme/app_notifier.dart';
import 'helpers/theme/app_theme.dart';
import 'screens/full_app.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

const String environment = 'staging'; // Replace with your logic to determine environment

@pragma('vm:entry-point')
Future<void> setupFirebaseMessaging() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  await FirebaseMessaging.instance.setAutoInitEnabled(true);

  NotificationSettings settings = await FirebaseMessaging.instance
      .requestPermission(
    alert: true,
    announcement: false,
    badge: true,
    carPlay: false,
    criticalAlert: false,
    provisional: false,
    sound: true,
  );

  if (settings.authorizationStatus == AuthorizationStatus.authorized) {
    FirebaseMessaging.onMessage.listen(_firebaseMessagingBackgroundHandler);
  } else if (settings.authorizationStatus == AuthorizationStatus.provisional) {
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('Got a message whilst in the foreground!');
      if (message.notification != null) {
        print('Notification Title: ${message.notification!.title}');
        print('Notification Body: ${message.notification!.body}');
      }
    });
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  } else {
    print('User declined or has not accepted permission');
  }

  final fcmToken = await FirebaseMessaging.instance.getToken();
  print("FCM Token: $fcmToken");
  await registerNotificationToken(fcmToken);

}

Future<void> registerNotificationToken(String? currentToken) async {
  var appConfig = null;
  switch (environment) {
    case 'development':
      appConfig = AppConfig.dev();
      break;
    case 'staging':
      appConfig = AppConfig.staging();
      break;
    case 'production':
      appConfig = AppConfig.production();
      break;
    default:
      throw Exception('Unknown environment: $environment');
  }
  const storage = FlutterSecureStorage();
  final token = await storage.read(key: 'token');

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
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  bool isAllowed = await AwesomeNotifications().isNotificationAllowed();
  if (!isAllowed) return;


  await AwesomeNotifications().createNotification(
      content: NotificationContent(
          id: -1, // -1 is replaced by a random number
          channelKey: 'basic_channel',
          title: message.notification?.title ,
          body: message.notification?.body,
          bigPicture: 'https://storage.googleapis.com/cms-storage-bucket/d406c736e7c4c57f5f61.png',
          largeIcon:'https://storage.googleapis.com/cms-storage-bucket/d406c736e7c4c57f5f61.png',
          notificationLayout: NotificationLayout.BigPicture,
          payload: {'notificationId': '1234567890'}),
      actionButtons: [
        NotificationActionButton(key: 'REDIRECT', label: 'Redirect'),
        NotificationActionButton(
            key: 'DISMISS',
            label: 'Dismiss',
            actionType: ActionType.DismissAction,
            isDangerousOption: true)
      ]
  );

}
void main() async {
  await setupFirebaseMessaging();
  AwesomeNotifications().initialize(
    // set the icon to null if you want to use the default app icon
      null,
      [
        NotificationChannel(
            channelGroupKey: 'basic_channel_group',
            channelKey: 'basic_channel',
            channelName: 'Basic notifications',
            channelDescription: 'Notification channel for basic tests',
            defaultColor: const Color(0xFF9D50DD),
            ledColor: Colors.white)
      ],
      // Channel groups are only visual and are not required
      channelGroups: [
        NotificationChannelGroup(
            channelGroupKey: 'basic_channel_group',
            channelGroupName: 'Basic group')
      ],
      debug: true
  );
  late final AppConfig appConfig;

  switch (environment) {
    case 'development':
      appConfig = AppConfig.dev();
      break;
    case 'staging':
      appConfig = AppConfig.staging();
      break;
    case 'production':
      appConfig = AppConfig.production();
      break;
    default:
      throw Exception('Unknown environment: $environment');
  }
  // late CustomTheme customTheme;
  // late ThemeData theme;
  //
  // customTheme = AppTheme.customTheme;
  // theme = AppTheme.theme;

  runApp(ChangeNotifierProvider<AppNotifier>(
    create: (context) => AppNotifier(),
    builder: (context, child) =>
        AppConfigProvider(
          appConfig: appConfig,
          child: MaterialApp(
            theme: ThemeData(
                elevatedButtonTheme: ElevatedButtonThemeData(
                  style: TextButton.styleFrom(
                      backgroundColor: const Color(0xff5a4a94),
                      padding: const EdgeInsets.symmetric(
                          vertical: 8, horizontal: 16),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10)),
                      textStyle: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          wordSpacing: 2,
                          letterSpacing: 2)),
                ),
                buttonTheme: const ButtonThemeData(
                  buttonColor: Color(0xff5a4a94),
                  shape: RoundedRectangleBorder(),
                  textTheme: ButtonTextTheme.accent,
                ),
                appBarTheme: const AppBarTheme(
                    color: Colors.white70,
                    elevation: 0,
                    iconTheme: IconThemeData(color: Colors.blueAccent))),
            debugShowCheckedModeBanner: false,
            initialRoute: "/",
            routes: {
              '/': (context) => const SplashScreen(),
              '/home': (context) => HomeScreen(),
              '/auth': (context) => LoginScreen(),
              '/normalbudget': (context) => NormalBudget(),
              '/capitalbudget': (context) => CapitalBudget(),
              '/safebudget': (context) => SafeBudget(),
              '/insiderbudget': (context) => const InsiderBudget(),
              '/information': (context) => InformationScreen(),
              '/no-internet-error': (context) => NoInternetScreen(),
            },
          ),
        ),
  ));
}

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  Future<void> validateToken(context) async {
    const secureStorage = FlutterSecureStorage();
    final token = await secureStorage.read(key: "token");
    if (token == null) {
      Navigator.pushReplacementNamed(context, '/auth');
    }
    final appConfig = AppConfigProvider
        .of(context)
        ?.appConfig;
    final url = Uri.parse('${appConfig?.apiBaseUrl}/users/checkToken');
    final headers = {
      'Authorization': 'Bearer $token',
    };

    try {
      final response = await http.get(url, headers: headers);

      if (response.statusCode == 200) {
        await Future<void>.delayed(const Duration(seconds: 2));
        Navigator.pushReplacementNamed(context, '/home');
      } else {
        Navigator.pushReplacementNamed(context, '/auth');
      }
    } catch (error) {
      print(error);
      Navigator.pushReplacementNamed(context, '/no-internet-error');
    }
  }

  @override
  Widget build(BuildContext context) {
    validateToken(context);
    return  Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Padding(
          padding: EdgeInsets.all(40.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              const Image(
                image: AssetImage('assets/logo.jpg'),
              ),
              LoadingAnimationWidget.fourRotatingDots(
                color: Colors.lightBlueAccent,
                size: 40,
              ),
            ],
          ),
          // child: HeartBeatAnimation(),
        ),
      ),
    );
  }
}
class HeartBeatAnimation extends StatefulWidget {
  const HeartBeatAnimation({super.key});

  @override
  _HeartBeatAnimationState createState() => _HeartBeatAnimationState();
}

class _HeartBeatAnimationState extends State<HeartBeatAnimation> {
  double heartSize = 100.0;
  bool growing = true;

  @override
  void initState() {
    super.initState();
    _startAnimation();
  }

  void _startAnimation() {
    Future.delayed(const Duration(milliseconds: 400), () {
      setState(() {
        heartSize = growing ? 220.0 : 200.0;
        growing = !growing;
        _startAnimation();
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    // return AnimatedContainer(
    //       duration: const Duration(milliseconds: 400),
    //       width: heartSize,
    //       height: heartSize,
    //       child: Image.asset('assets/logo.jpg'), // Replace with your heart image
    //
    // );
    return HeartBeat(
      child: const CircleAvatar(
        radius: 150.0,
        backgroundImage: AssetImage('assets/logo.jpg'),
      ),
    );
  }
}