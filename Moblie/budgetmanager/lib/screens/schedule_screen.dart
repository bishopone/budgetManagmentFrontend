import 'dart:convert';

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

import '../config.dart';
import '../models/budget_request.dart';
import '../models/log_request.dart';

class HealthScheduleScreen extends StatefulWidget {
  final Function changeindex;

  const HealthScheduleScreen({super.key, required this.changeindex});

  @override
  _HealthScheduleScreenState createState() => _HealthScheduleScreenState();
}

class _HealthScheduleScreenState extends State<HealthScheduleScreen> {
  Future<List<BudgetRequest>> fetchBudgetRequest() async {
    try {
      const storage = FlutterSecureStorage();
      final user = await storage.read(key: 'user');
      final decodeduser = jsonDecode(user!);
      final appConfig = AppConfigProvider.of(context)?.appConfig;
      final response = await http.get(Uri.parse(
          '${appConfig?.apiBaseUrl}/budget/request/${decodeduser['UserID']}'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data.isNotEmpty) {
          return BudgetRequest.fromJsonList(data);
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
    final response = await http
        .get(Uri.parse('${appConfig?.apiBaseUrl}/budget/logs/$requestID'));

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      // print(data);
      return data.map((json) => BudgetLog.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load data from the API');
    }
  }

  @override
  void initState() {
    super.initState();
    // customTheme = AppTheme.customTheme;
    // theme = AppTheme.theme;
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
            Container(
              margin: MySpacing.fromLTRB(24, 24, 24, 0),
              child: MyText.titleMedium("Activity",
                  color: theme.colorScheme.onBackground,
                  muted: true,
                  fontWeight: 600),
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
                            margin: MySpacing.fromLTRB(8,0,8,8),
                            child: ListView.builder(
                              physics: NeverScrollableScrollPhysics(),
                              scrollDirection: Axis.vertical,
                             itemCount: snapshot.data!.length,
                              itemBuilder: (context,index){
                                final data = snapshot.data![index];
                                DateTime date = DateTime.parse(data.changeDate.toIso8601String());
                                String formattedDate = formatter.format(date);
                                print(data);
                                return singleActivityWidget(
                                    imgdata: data.ProfilePictureLink,
                                    time: formattedDate,
                                    editorname: data.changedByUserName,
                                    editedcase: data.newState,
                                    phonenumber: data.PhoneNumber
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

  Widget singleDateWidget({String? date, required int index}) {
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
          color: theme.colorScheme.primary,
          borderRadiusAll: 4,
          padding: MySpacing.fromLTRB(0, 8, 0, 14),
          child: Column(
            children: [
              MyText.bodySmall(
                date.toString(),
                fontWeight: 600,
                color: theme.colorScheme.onPrimary,
                height: 1.9,
                textAlign: TextAlign.center,
              ),
              Container(
                margin: MySpacing.top(12),
                height: 8,
                width: 8,
                decoration: BoxDecoration(
                    color: theme.colorScheme.onPrimary, shape: BoxShape.circle),
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
      required String phonenumber
      }) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Row(
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
                        image: NetworkImage(imgdata ==
                            ""
                            ? "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740&t=st=1696599824~exp=1696600424~hmac=b1c23d7d66b5cd491fb7031a390d1f991a24ba0a03304ff2acfda8b3c4cddf0b"
                            : imgdata),
                        width: 50,
                        height: 50,
                        fit: BoxFit.cover,
                      ),
                  ),
                   const SizedBox(height: 5,width: 5,),
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
    );
  }
}