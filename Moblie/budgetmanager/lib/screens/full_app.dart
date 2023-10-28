/*
* File : Shopping App
* Version : 1.0.0
* */

import 'package:budgetmanager/screens/activity_screen.dart';
import 'package:budgetmanager/screens/home_screen.dart';
import 'package:budgetmanager/screens/profile_screen.dart';
import 'package:budgetmanager/screens/schedule_screen.dart';
import 'package:budgetmanager/helpers/theme/app_notifier.dart';
import 'package:budgetmanager/helpers/theme/app_theme.dart';
import 'package:budgetmanager/helpers/utils/my_shadow.dart';
import 'package:budgetmanager/helpers/widgets/my_card.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  int _currentIndex = 0;

  late CustomTheme customTheme;
  late ThemeData theme;

  TabController? _tabController;

  _handleTabSelection() {
    setState(() {
      _currentIndex = _tabController!.index;
    });
  }
  void changeTab(int index) {
    setState(() {
      _currentIndex = index;
      _tabController!.animateTo(index); // Scroll to the desired tab
    });
  }
  @override
  void initState() {
    customTheme = AppTheme.customTheme;
    theme = AppTheme.theme;
    _tabController = TabController(length: 3, vsync: this, initialIndex: 0);
    _tabController!.addListener(_handleTabSelection);
    _tabController!.animation!.addListener(() {
      final aniValue = _tabController!.animation!.value;
      if (aniValue - _currentIndex > 0.5) {
        setState(() {
          _currentIndex = _currentIndex + 1;
        });
      } else if (aniValue - _currentIndex < -0.5) {
        setState(() {
          _currentIndex = _currentIndex - 1;
        });
      }
    });
    super.initState();
  }

  onTapped(value) {
    setState(() {
      _currentIndex = value;
    });
  }

  @override
  dispose() {
    super.dispose();
    _tabController!.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppNotifier>(
      builder: (BuildContext context, AppNotifier value, Widget? child) {
        return Scaffold(
            bottomNavigationBar: BottomAppBar(
                elevation: 0,
                shape: CircularNotchedRectangle(),
                child: MyCard.none(
                  color: theme.colorScheme.background,
                  shadow: MyShadow(
                      position: MyShadowPosition.top, elevation: 2, alpha: 20),
                  padding: EdgeInsets.only(top: 12, bottom: 12),
                  child: TabBar(
                    controller: _tabController,
                    indicator: BoxDecoration(),
                    indicatorSize: TabBarIndicatorSize.tab,
                    indicatorColor: theme.colorScheme.primary,
                    tabs: <Widget>[
                      Container(
                        child: (_currentIndex == 0)
                            ? Column(
                                mainAxisSize: MainAxisSize.min,
                                children: <Widget>[
                                  Icon(
                                    Icons.home,
                                    color: theme.colorScheme.primary,
                                  ),
                                  Container(
                                    margin: EdgeInsets.only(top: 4),
                                    decoration: BoxDecoration(
                                        color: theme.primaryColor,
                                        borderRadius: BorderRadius.all(
                                            Radius.circular(2.5))),
                                    height: 5,
                                    width: 5,
                                  )
                                ],
                              )
                            : Icon(
                                Icons.home_outlined,
                                color: theme.colorScheme.onBackground,
                              ),
                      ),
                      // Container(
                      //     child: (_currentIndex == 1)
                      //         ? Column(
                      //             mainAxisSize: MainAxisSize.min,
                      //             children: <Widget>[
                      //               Icon(
                      //                 Icons.directions_run,
                      //                 color: theme.colorScheme.primary,
                      //               ),
                      //               Container(
                      //                 margin: EdgeInsets.only(top: 4),
                      //                 decoration: BoxDecoration(
                      //                     color: theme.primaryColor,
                      //                     borderRadius: BorderRadius.all(
                      //                         Radius.circular(2.5))),
                      //                 height: 5,
                      //                 width: 5,
                      //               )
                      //             ],
                      //           )
                      //         : Icon(
                      //             Icons.directions_run_outlined,
                      //             color: theme.colorScheme.onBackground,
                      //           )),
                      Container(
                          child: (_currentIndex == 1)
                              ? Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: <Widget>[
                                    Icon(
                                      Icons.calendar_month,
                                      color: theme.colorScheme.primary,
                                    ),
                                    Container(
                                      margin: EdgeInsets.only(top: 4),
                                      decoration: BoxDecoration(
                                          color: theme.primaryColor,
                                          borderRadius: BorderRadius.all(
                                              Radius.circular(2.5))),
                                      height: 5,
                                      width: 5,
                                    )
                                  ],
                                )
                              : Icon(
                                  Icons.calendar_month_outlined,
                                  color: theme.colorScheme.onBackground,
                                )),
                      Container(
                          child: (_currentIndex == 2)
                              ? Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: <Widget>[
                                    Icon(
                                      Icons.person,
                                      color: theme.colorScheme.primary,
                                    ),
                                    Container(
                                      margin: EdgeInsets.only(top: 4),
                                      decoration: BoxDecoration(
                                          color: theme.primaryColor,
                                          borderRadius: BorderRadius.all(
                                              Radius.circular(2.5))),
                                      height: 5,
                                      width: 5,
                                    )
                                  ],
                                )
                              : Icon(
                                  Icons.person_outline,
                                  color: theme.colorScheme.onBackground,
                                )),
                    ],
                  ),
                )),
            body: TabBarView(
              controller: _tabController,
              children: <Widget>[
                HealthHomeScreen(),
                HealthScheduleScreen( changeindex:changeTab),
                HealthProfileScreen(),
              ],
            ),
        );
      },
    );
  }
}
