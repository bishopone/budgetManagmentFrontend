// Copyright 2019 Aleksander Woźniak
// SPDX-License-Identifier: Apache-2.0

import 'dart:convert';
import 'dart:typed_data';
import 'package:budgetmanager/screens/schedule_screen.dart';
import 'package:http/http.dart' as http;

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:intl/intl.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:ethiopian_calendar/ethiopian_date_converter.dart';

import '../config.dart';
import '../helpers/theme/app_theme.dart';
import '../helpers/widgets/my_container.dart';
import '../helpers/widgets/my_spacing.dart';
import '../helpers/widgets/my_text.dart';
import '../models/budget_request.dart';
import '../models/log_request.dart';

class TableEventsExample extends StatefulWidget {
  @override
  _TableEventsExampleState createState() => _TableEventsExampleState();
}

class _TableEventsExampleState extends State<TableEventsExample> {
  late final ValueNotifier<List<BudgetRequest>> _selectedEvents;
  CalendarFormat _calendarFormat = CalendarFormat.month;
  RangeSelectionMode _rangeSelectionMode = RangeSelectionMode
      .toggledOff; // Can be toggled on/off by longpressing a date
  DateTime _focusedDay =
      EthiopianDateConverter.convertToEthiopianDate(DateTime.now());
  DateTime? _selectedDay;
  DateTime? _rangeStart;
  DateTime? _rangeEnd;
  List<BudgetRequest> budgetrequests = [];
  List<dynamic> completeSteps = [];

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
      final response = await http.get(
          Uri.parse(
              '${appConfig?.apiBaseUrl}/budget/request/${decodeduser['UserID']}'),
          headers: headers);
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data.isNotEmpty) {
          budgetrequests = BudgetRequest.fromJsonList(data).reversed.toList();
          return budgetrequests;
        } else {
          throw Exception(
              'No data available for Request ID ${decodeduser['UserID']}');
        }
      } else {
        throw Exception('Failed to load data from the API');
      }
    } catch (error) {
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
    final response = await http.get(
        Uri.parse('${appConfig?.apiBaseUrl}/budget/logs/state/$requestID'),
        headers: headers);

    if (response.statusCode == 200) {
      print("data");
      print(response.body);
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => BudgetLog.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load data from the API');
    }
  }

  Future<void> onView(String requestId) async {
    final appConfig = AppConfigProvider.of(context)?.appConfig;
    const secureStorage = FlutterSecureStorage();
    final token = await secureStorage.read(key: "token");
    final url = Uri.parse(
        "${appConfig?.apiBaseUrl}/pdf/generate-pdf/$requestId?token=$token"); // Replace with your server URL

    try {
      if (!await canLaunchUrl(url)) {
        throw Exception('Could not launch $url');
      }
      await launchUrl(url);
    } catch (error) {}
  }

  Future<void> launchInBrowser(Uint8List data) async {
    final url = Uri.parse('data:application/pdf;base64,${base64Encode(data)}');
    if (!await canLaunchUrl(url)) {
      throw Exception('Could not launch $url');
    }
    await launchUrl(url);
  }

  @override
  void initState() {
    super.initState();

    _selectedDay = _focusedDay;
    _selectedEvents = ValueNotifier(
        _getEventsForDayFromRequest(_selectedDay!, budgetrequests));
    _selectedEvents.value =
        _getEventsForDayFromRequest(_selectedDay!, budgetrequests);
    DateTime now = EthiopianDateConverter.convertToEthiopianDate(DateTime.now());

    dayOfMonth = now.day;
    dayOfWeek = DateFormat('EEEE').format(now);
    budgetRequest = fetchBudgetRequest();
  }

  int selectedDate = 0;
  late Future<List<BudgetRequest>> budgetRequest;
  late int dayOfMonth;
  late String dayOfWeek;
  DateFormat formatter = DateFormat('MMM d hh:mm a');
  int selectedRequest = 0;
  DateTime FirstDay =
      EthiopianDateConverter.convertToEthiopianDate(DateTime(2000));
  DateTime LastDay =
      EthiopianDateConverter.convertToEthiopianDate(DateTime.now().add(Duration(days: 3)));

  void changeDateFormat() {
    setState(() {
      FirstDay = EthiopianDateConverter.convertToEthiopianDate(FirstDay);
      LastDay = EthiopianDateConverter.convertToEthiopianDate(LastDay);
    });
  }

  final budgetTypes = [
    "መደበኛ በጀት",
    "የራስ ካፒታል በጀት",
    "መጠባበቂያ በጀት",
    "የውጪ ካፒታል ወስበጀት",
    "ውስጠ ገቢ",
  ];

  @override
  void dispose() {
    _selectedEvents.dispose();
    super.dispose();
  }

  bool compareDates(String dateString1, String dateString2) {
    DateTime date1 = EthiopianDateConverter.convertToEthiopianDate(
        DateTime.parse(dateString1).toUtc());
    DateTime date2 = DateTime.parse(dateString2).toUtc();

    // Compare date properties
    return date1.year == date2.year &&
        date1.month == date2.month &&
        date1.day == date2.day;
  }

  List<BudgetRequest> _getEventsForDayFromRequest(DateTime day, data) {
    // Implementation example
    List<BudgetRequest> eventsForDay = data
            ?.where((x) => compareDates(
                x.requestDate.toIso8601String(), day.toIso8601String()))
            .toList() ??
        [];
    return eventsForDay ?? [];
  }

  void _onDaySelected(DateTime selectedDay, DateTime focusedDay) {
    if (!isSameDay(_selectedDay, selectedDay)) {
      setState(() {
        _selectedDay = selectedDay;
        _focusedDay = focusedDay;
        _rangeStart = null; // Important to clean those
        _rangeEnd = null;
        _rangeSelectionMode = RangeSelectionMode.toggledOff;
      });
    }
    _selectedEvents.value =
        _getEventsForDayFromRequest(selectedDay, budgetrequests);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder<List<BudgetRequest>>(
          future: budgetRequest,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return LoadingAnimationWidget.stretchedDots(
                color: Colors.lightBlueAccent,
                size: 40,
              );
            }
            if (snapshot.connectionState == ConnectionState.done) {
              return Column(
                children: [
                  Container(
                    width: double.infinity,
                    height: 400,
                    child: TableCalendar<BudgetRequest>(
                      firstDay: FirstDay,
                      lastDay: LastDay,
                      focusedDay: _focusedDay,
                      calendarBuilders: CalendarBuilders(
                          dowBuilder: (context, day) {
                              final text = DateFormat.E().format(day);
                              final daytext = EthiopianDateConverter.convertToGregorianDate(day);
                              print(text);
                              print(day);
                              final Ethiopianweekdays = [
                                "ሰኞ",   // Senay
                                "ማክሰኞ", // Maksegno
                                "ረቡዕ",  // Rebu'e
                                "ሐሙስ",  // Hamus
                                "አርብ",   // Arbe
                                "ቅዳሜ",
                                "እሑድ", // Ehadu
                              ];
                              print(DateFormat.E().format(daytext));
                              return Center(
                                child: Text(
                                  Ethiopianweekdays[daytext.weekday -1 ],
                                ),
                              );

                          },
                        headerTitleBuilder: (context, day) {
                          const ethiopianMonths = [
                            'መስከረም (Meskerem)',
                            'ጥቅምት (Tikimt)',
                            'ኀዳር (Hidar)',
                            'ታኅሣሥ (Tahsas)',
                            'ጥር (Tir)',
                            'የካቲት (Yekatit)',
                            'መጋቢት (Megabit)',
                            'ሚያዝያ (Miazia)',
                            'ግንቦት (Ginbot)',
                            'ሰኔ (Sene)',
                            'ሐምሌ (Hamle)',
                            'ነሐሴ (Nehase)',
                            'ጳጉሜ (Pagumē)'
                          ];
                          return Row(children: [
                            Text(ethiopianMonths[day.month - 1].toString()),
                          ]);
                        },

                      ),
                      selectedDayPredicate: (day) =>
                          isSameDay(_selectedDay, day),
                      rangeStartDay: _rangeStart,
                      rangeEndDay: _rangeEnd,
                      calendarFormat: _calendarFormat,
                      rangeSelectionMode: _rangeSelectionMode,
                      eventLoader: (day) =>
                          _getEventsForDayFromRequest(day, snapshot.data),
                      startingDayOfWeek: StartingDayOfWeek.monday,
                      calendarStyle: CalendarStyle(
                        // Use `CalendarStyle` to customize the UI
                        outsideDaysVisible: false,
                      ),
                      onDaySelected: _onDaySelected,
                      onPageChanged: (focusedDay) {
                        _focusedDay = focusedDay;
                      },
                    ),
                  ),
                  Expanded(
                    child: ValueListenableBuilder<List<BudgetRequest>>(
                      valueListenable: _selectedEvents,
                      builder: (context, value, _) {
                        return ListView.builder(
                          itemCount: value.length,
                          itemBuilder: (context, index) {
                            print(value[index].requestStatus);
                            print(value[index].type);

                            return Container(
                              decoration: BoxDecoration(
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(4)),
                            ),
                              margin: const EdgeInsets.symmetric(
                                horizontal: 12.0,
                                vertical: 4.0,
                              ),
                              child: Column(
                                children: [
                              Banner(
                                color: value[index].requestStatus == "Pending"
                                    ? Colors.yellow
                                    : value[index].requestStatus == "Approved"
                                    ? Colors.green
                                    : Colors.red,
                              message: value[index].requestStatus, location: BannerLocation.topStart,

                                    child: ListTile(
                                      leading:SizedBox(
                                        height: 50,
                                        width: 50,
                                      ),
                                      onTap: () => setState(() {
                                        if (selectedRequest ==
                                            value[index].requestID) {
                                          selectedRequest = 0;
                                          return;
                                        }
                                        selectedRequest = value[index].requestID;
                                      }),
                                      title: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text('ከ - ${value[index].fromDep}'),
                                          Text(
                                              ' - ${budgetTypes[value[index].type - 1]} - '),
                                          Text('ወደ - ${value[index].toDep}'),
                                          if (selectedRequest != 0)
                                            IconButton(
                                                onPressed: () => onView(
                                                    selectedRequest.toString()),
                                                icon: const Icon(Icons.download))
                                        ],
                                      ),
                                    ),
                                  ),
                                  if (value[index].requestID ==
                                          selectedRequest &&
                                      selectedRequest != 0)
                                    SizedBox(
                                      height: 500,
                                      child: FutureBuilder<List<BudgetLog>>(
                                          future:
                                              fetchBudgetLogs(selectedRequest),
                                          builder: (context, snapshot) {
                                            if (snapshot.connectionState ==
                                                ConnectionState.waiting) {
                                              return Column(
                                                mainAxisAlignment:
                                                    MainAxisAlignment.center,
                                                children: [
                                                  LoadingAnimationWidget
                                                      .dotsTriangle(
                                                    color:
                                                        Colors.lightBlueAccent,
                                                    size: 40,
                                                  ),
                                                ],
                                              );
                                            }
                                            if (snapshot.connectionState ==
                                                    ConnectionState.done &&
                                                snapshot.hasData) {
                                              return Container(
                                                margin: MySpacing.fromLTRB(
                                                    8, 0, 8, 8),
                                                child: ListView.builder(
                                                  // physics: NeverScrollableScrollPhysics(),
                                                  scrollDirection:
                                                      Axis.vertical,
                                                  itemCount:
                                                      snapshot.data!.length,
                                                  itemBuilder:
                                                      (context, index) {
                                                    final data =
                                                        snapshot.data![index];
                                                    DateTime date =
                                                        DateTime.parse(data
                                                            .changeDate
                                                            .toIso8601String());
                                                    String formattedDate =
                                                        formatter.format(date);
                                                    return singleActivityWidget(
                                                        imgdata: data
                                                            .ProfilePictureLink,
                                                        time: formattedDate,
                                                        editorname: data
                                                            .changedByUserName,
                                                        editedcase:
                                                            data.newState,
                                                        phonenumber:
                                                            data.PhoneNumber,
                                                        authorityID:
                                                            data.AuthorityName,
                                                        isreject: data.comment);
                                                  },
                                                ),
                                              );
                                            }
                                            return const Text(
                                                'error try again!!!');
                                          }),
                                    ),
                                ],
                              ),
                            );
                          },
                        );
                      },
                    ),
                  ),
                ],
              );
            }
            return LoadingAnimationWidget.stretchedDots(
              color: Colors.lightBlueAccent,
              size: 40,
            );
          }),
    );
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
      required String authorityID,
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
                          image: NetworkImage(
                              "${appConfig?.apiBaseUrl}/${imgdata}"),
                          width: 50,
                          height: 50,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            // Handle the error here
                            return Image.asset(
                              'assets/logo.jpg',
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
                            MyText.bodyMedium(
                                editedcase == "" ? authorityID : editedcase,
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
          if (isreject != null && editedcase == "The Request Has Been Rejected")
            MyText.bodyMedium(isreject,
                overflow: TextOverflow.fade,
                color: theme.colorScheme.onBackground,
                fontWeight: 600),
        ],
      ),
    );
  }
}
