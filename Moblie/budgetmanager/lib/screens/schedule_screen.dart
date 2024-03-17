import 'dart:convert';
import 'dart:typed_data';

import 'package:budgetmanager/helpers/theme/app_theme.dart';
import 'package:budgetmanager/helpers/widgets/my_container.dart';
import 'package:budgetmanager/helpers/widgets/my_spacing.dart';
import 'package:budgetmanager/helpers/widgets/my_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';

import '../config.dart';
import '../models/budget_request.dart';
import '../models/log_request.dart';

final List<Color> budgetTypeColors = [
  Colors.green,
  Colors.blueAccent,
  Colors.orangeAccent,
  Colors.brown,
];

class HealthScheduleScreen extends StatefulWidget {
  final Function changeindex;

  const HealthScheduleScreen({super.key, required this.changeindex});

  @override
  _HealthScheduleScreenState createState() => _HealthScheduleScreenState();
}

class _HealthScheduleScreenState extends State<HealthScheduleScreen> {
  Future<List<BudgetRequest>> fetchBudgetRequest() async {
    try {
      const secureStorage = FlutterSecureStorage();
      final token = await secureStorage.read(key: "token");
      final headers = {
        "Content-Type": "application/json",
        'Authorization': 'Bearer $token',
      };
      const storage = FlutterSecureStorage();
      final user = await storage.read(key: 'user');
      final decodeduser = jsonDecode(user!);
      final appConfig = AppConfigProvider.of(context)?.appConfig;
      final response = await http.get(Uri.parse(
          '${appConfig?.apiBaseUrl}/budget/request/${decodeduser['UserID']}'),headers:headers);
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data.isNotEmpty) {
          final List<BudgetRequest> budgetrequests  = BudgetRequest.fromJsonList(data);
          return budgetrequests.reversed.toList();
        } else {
          throw Exception(
              'No data available for Request ID ${decodeduser['UserID']}');
        }
      } else {
        throw Exception('Failed to load data from the API');
      }
    } catch (error) {
      print(error);
      throw Exception('Failed to load data from the API');
    }
  }

  Future<List<BudgetLog>> fetchBudgetLogs(int requestID) async {
    final appConfig = AppConfigProvider.of(context)?.appConfig;
    const secureStorage = FlutterSecureStorage();
    final token = await secureStorage.read(key: "token");
    final headers = {
      "Content-Type": "application/json",
      'Authorization': 'Bearer $token',
    };
    final response = await http
        .get(Uri.parse('${appConfig?.apiBaseUrl}/budget/logs/$requestID'),headers: headers);

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      // print(data);
      return data.map((json) => BudgetLog.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load data from the API');
    }
  }

  Future<void> onView(String requestId) async {
    final appConfig = AppConfigProvider.of(context)?.appConfig;
    const secureStorage = FlutterSecureStorage();
    final token = await secureStorage.read(key: "token");
    final headers = {
      "Content-Type": "application/json",
      'Authorization': 'Bearer $token',
    };
    print(requestId);
    final url = Uri.parse(
        "${appConfig?.apiBaseUrl}/pdf/generate-pdf/$requestId?token=$token"); // Replace with your server URL

    try {
      if (!await canLaunchUrl(url)) {
        throw Exception('Could not launch $url');
      }
      await launchUrl(url);

    } catch (error) {
      print('Error: $error');
    }
  }

  Future<void> launchInBrowser(Uint8List data) async {
    print(base64Encode(data));
    print("base64Encode(data)");
    final url = Uri.parse('data:application/pdf;base64,${base64Encode(data)}');
    if (!await canLaunchUrl(url)) {
      throw Exception('Could not launch $url');
    }
    await launchUrl(url);
  }

  @override
  void initState() {
    super.initState();

    DateTime now = DateTime.now();
    dayOfMonth = now.day;
    dayOfWeek = DateFormat('EEEE').format(now);
    budgetRequest = fetchBudgetRequest();
  }

  int selectedDate = 0;
  late Future<List<BudgetRequest>> budgetRequest;
  late int dayOfMonth;
  late String dayOfWeek;
  DateFormat formatter = DateFormat('MMM d hh:mm a');

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        floatingActionButton: FloatingActionButton(
          onPressed: () {
            widget.changeindex(0);
          },
          backgroundColor: theme.colorScheme.primary,
          child: Icon(
            LucideIcons.plus,
            color: theme.colorScheme.onPrimary,
          ),
        ),
        body: ListView(
          padding: MySpacing.top(MySpacing.safeAreaTop(context) + 20),
          children: [
            Container(
              margin: MySpacing.fromLTRB(24, 0, 24, 0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      MyText.bodyMedium("Today",
                          letterSpacing: 0,
                          color: theme.colorScheme.onBackground,
                          fontWeight: 500),
                      MyText.bodyLarge("${dayOfWeek} ${dayOfMonth}",
                          color: theme.colorScheme.onBackground,
                          fontWeight: 600),
                    ],
                  ),
                  Icon(
                    LucideIcons.calendar,
                    size: 22,
                    color: theme.colorScheme.onBackground,
                  )
                ],
              ),
            ),
            FutureBuilder<List<BudgetRequest>>(
                future: budgetRequest,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return LoadingAnimationWidget.stretchedDots(
                      color: Colors.lightBlueAccent,
                      size: 40,
                    );
                  }
                  if (snapshot.connectionState == ConnectionState.done) {
                    return Container(
                      margin: MySpacing.top(12),
                      padding: const EdgeInsets.all(10),
                      child: SizedBox(
                        width: double.infinity,
                        height: 120,
                        child: ListView.builder(
                            itemCount: snapshot.data?.length ?? 0,
                            scrollDirection: Axis.horizontal,
                            itemBuilder: (context, index) {
                              DateTime date = DateTime.parse(snapshot
                                  .data![index].requestDate
                                  .toIso8601String());
                              int year = date.year;
                              String month = date.month.toString();
                              int day = date.day;
                              return singleDateWidget(
                                  date: "${day}\n${month}\n${year}",
                                  type: snapshot.data![index].type,
                                  index: snapshot.data![index].requestID);
                            }),
                      ),
                    );
                  }
                  return LoadingAnimationWidget.stretchedDots(
                    color: Colors.lightBlueAccent,
                    size: 40,
                  );
                }),
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  margin: MySpacing.fromLTRB(24, 0, 0, 0),
                  child: MyText.titleMedium("Activity",
                      color: theme.colorScheme.onBackground,
                      muted: true,
                      fontWeight: 600),
                ),
                if (selectedDate != 0)
                  IconButton(
                      onPressed: () => onView(selectedDate.toString()),
                      icon: const Icon(Icons.download))
              ],
            ),
            if (selectedDate != 0)
              SizedBox(
                height: 500,
                child: FutureBuilder<List<BudgetLog>>(
                    future: fetchBudgetLogs(selectedDate),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            LoadingAnimationWidget.dotsTriangle(
                              color: Colors.lightBlueAccent,
                              size: 40,
                            ),
                          ],
                        );
                      }
                      if (snapshot.connectionState == ConnectionState.done &&
                          snapshot.hasData) {
                        return Container(
                          margin: MySpacing.fromLTRB(8, 0, 8, 8),
                          child: ListView.builder(
                            // physics: NeverScrollableScrollPhysics(),
                            scrollDirection: Axis.vertical,
                            itemCount: snapshot.data!.length,
                            itemBuilder: (context, index) {
                              final data = snapshot.data![index];
                              DateTime date = DateTime.parse(
                                  data.changeDate.toIso8601String());
                              String formattedDate = formatter.format(date);
                              print("data");
                              print(data.comment);
                              return singleActivityWidget(
                                  imgdata: data.ProfilePictureLink,
                                  time: formattedDate,
                                  editorname: data.changedByUserName,
                                  editedcase: data.newState,
                                  phonenumber: data.PhoneNumber,
                                  isreject:data.comment
                              );
                            },
                          ),
                        );
                      }
                      return const Text('error try again!!!');
                    }),
              ),
          ],
        ));
  }

  Widget singleDateWidget(
      {String? date, required int index, required int type}) {
    if (selectedDate == index) {
      return InkWell(
        onTap: () {
          setState(() {
            selectedDate = index;
          });
        },
        child: MyContainer(
          height: 100,
          width: 50,
          color: budgetTypeColors[type - 1],
          borderRadiusAll: 4,
          padding: MySpacing.fromLTRB(0, 8, 0, 14),
          child: Column(
            children: [
              MyText.bodySmall(
                date.toString(),
                fontWeight: 600,
                color: theme.colorScheme.onBackground,
                height: 1.9,
                textAlign: TextAlign.center,
              ),
              Container(
                margin: MySpacing.top(12),
                height: 8,
                width: 8,
                decoration: BoxDecoration(
                    color: theme.colorScheme.onBackground,
                    shape: BoxShape.circle),
              )
            ],
          ),
        ),
      );
    }
    return InkWell(
      onTap: () {
        setState(() {
          selectedDate = index;
        });
      },
      child: MyContainer(
        width: 50,
        color: budgetTypeColors[type - 1],
        margin: const EdgeInsets.all(8),
        borderRadiusAll: 4,
        padding: MySpacing.fromLTRB(0, 8, 0, 14),
        child: Column(
          children: [
            MyText.bodySmall(
              date.toString(),
              fontWeight: 600,
              color: theme.colorScheme.onBackground,
              height: 1.9,
              textAlign: TextAlign.center,
            )
          ],
        ),
      ),
    );
  }

  Widget singleActivityWidget(
      {required String time,
      required String imgdata,
      required String editedcase,
      required String editorname,
      required String? isreject,
      required String phonenumber}) {
    final appConfig = AppConfigProvider.of(context)?.appConfig;

    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        children: [
          Row(
            children: [
              SizedBox(
                  width: 72,
                  child: MyText.bodySmall(
                    time,
                    muted: true,
                    letterSpacing: 0,
                  )),
              Expanded(
                child: MyContainer(
                  width: double.infinity,
                  padding: MySpacing.all(12),
                  borderRadiusAll: 4,
                  child: Row(
                    children: [
                      Container(
                        // padding: MySpacing.all(8),
                        decoration: const BoxDecoration(
                            borderRadius: BorderRadius.all(Radius.circular(4))),
                        child: Image(
                          image: NetworkImage("${appConfig?.apiBaseUrl}/${imgdata}"),
                          width: 50,
                          height: 50,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            // Handle the error here
                            print("Error loading image: $error");
                            return Image.asset(
                              'assets/profile.jpg', // Replace with the path to your asset image
                              width: 50,
                              height: 50,
                              fit: BoxFit.cover,
                            );
                          },
                        ),
                      ),
                      const SizedBox(
                        height: 5,
                        width: 5,
                      ),
                      Expanded(
                        // margin: MySpacing.left(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            MyText.bodyMedium(editedcase,
                                overflow: TextOverflow.fade,
                                color: theme.colorScheme.onBackground,
                                fontWeight: 600),
                            MyText.bodySmall(editorname,
                                fontSize: 12,
                                color: theme.colorScheme.onBackground,
                                fontWeight: 500,
                                muted: true),
                            MyText.bodySmall(phonenumber,
                                fontSize: 12,
                                color: theme.colorScheme.onBackground,
                                fontWeight: 500,
                                muted: true),
                          ],

                        ),

                      )
                    ],
                  ),
                ),
              )
            ],
          ),
          if(isreject != null && editedcase == "The Request Has Been Rejected")
            MyText.bodyMedium(isreject,
                overflow: TextOverflow.fade,
                color: theme.colorScheme.onBackground,
                fontWeight: 600),
        ],
      ),
    );
  }
}
