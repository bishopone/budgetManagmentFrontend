import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:graphic/graphic.dart';
import 'package:http/http.dart' as http;
import 'package:loading_animation_widget/loading_animation_widget.dart';

import '../../config.dart';
import './data.dart';

class AnalysisScreen extends StatefulWidget {
  AnalysisScreen({Key? key}) : super(key: key);

  @override
  State<AnalysisScreen> createState() => _AnalysisScreenState();
}

class _AnalysisScreenState extends State<AnalysisScreen>
    with SingleTickerProviderStateMixin {
  late Future fetchdata;
  late AnimationController _fabController;
  late Animation<double> _fabAnimation;

  bool rebuild = false;

  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  Future<List<dynamic>> fetchanalysisdata() async {
    try {
      final appConfig = AppConfigProvider.of(context)?.appConfig;
      const secureStorage = FlutterSecureStorage();
      final token = await secureStorage.read(key: "token");
      final headers = {
        "Content-Type": "application/json",
        'Authorization': 'Bearer $token',
      };
      final response = await http.get(
          Uri.parse('${appConfig?.apiBaseUrl}/analysis/all-single-analyses'),
          headers: headers);
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        print(data);
        return data;
      } else {
        throw Exception('Failed to load data from the API');
      }
    } catch (error) {
      print(error);
      throw error;
    }
  }

  List<Map<dynamic, dynamic>> convertListToMapList(List<dynamic> inputList) {
    print(inputList);
    List<Map<dynamic, dynamic>> result = [];

    for (var item in inputList) {
      if (item is Map<dynamic, dynamic>) {
        result.add(item as Map<dynamic, dynamic>);
      } else {
        // Handle the case where the element is not a Map
        // For example, you can skip it or provide a default value
        result.add({});
      }
    }

    return result;
  }

  @override
  void initState() {
    super.initState();
    _fabController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );

    _fabAnimation = Tween<double>(begin: 0, end: 1).animate(_fabController);
  }

  @override
  void dispose() {
    _fabController.dispose();
    super.dispose();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    fetchdata = fetchanalysisdata();
  }

  Future<void> _refreshData() async {
    try {
      // Start the rotation animation
      _fabController.repeat();

      // Trigger the data fetching process
      setState(() {
        fetchdata = fetchanalysisdata();
        rebuild = true;
      });
    } catch (error) {
      // Handle errors, if any
      print('Error refreshing data: $error');
    } finally {
      // Stop the rotation animation
      _fabController.reset();
    }
  }

  @override
  Widget build(BuildContext context) {
    if (Platform.isWindows) {
      return Scaffold(
        key: _scaffoldKey,
        backgroundColor: Colors.white,
        body: FutureBuilder(
            future: fetchdata,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return Container(
                  child: Center(child:   LoadingAnimationWidget.inkDrop(
                    color: Colors.blueAccent,
                    size: 50,
                  )),
                );
              }
              if (!snapshot.hasData) {
                return Container(
                  child: Center(child:   LoadingAnimationWidget.inkDrop(
                    color: Colors.blueAccent,
                    size: 50,
                  )),
                );
              }
              return ListView(
                children: <Widget>[
                  Container(
                    padding: const EdgeInsets.fromLTRB(20, 40, 20, 5),
                    child: const Text(
                      'Status Chart',
                      style: TextStyle(fontSize: 20,fontWeight: FontWeight.bold),textAlign: TextAlign.center,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.fromLTRB(10, 5, 10, 0),
                    alignment: Alignment.center,

                    child: const Text(
                      'በሁኔታ ላይ የተመሠረቱ ጥያቄዎች በመጠባበቅ ላይ, ውድቅ ተደርጓል, ጸድቋል.',                      style: TextStyle(fontSize: 20,fontWeight: FontWeight.bold),textAlign: TextAlign.center,

                    ),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      ...snapshot.data[0]["requestStats"].asMap().entries.map(
                          (entry) => AnimatedCard(
                              index: entry.key, data: entry.value)),
                    ],
                  ),
                  Container(
                    margin: const EdgeInsets.only(top: 10),
                    width: 350,
                    height: 300,
                    child: Chart(
                      rebuild: rebuild,
                      data: convertListToMapList(
                          snapshot.data[0]["requestStats"]),
                      variables: {
                        'status': Variable(
                          accessor: (Map map) => map['RequestStatus'] as String,
                        ),
                        'value': Variable(
                          accessor: (Map map) => map['Count'] as num,
                          scale: LinearScale(min: 0, marginMax: 0.1),
                        ),
                      },
                      marks: [
                        IntervalMark(
                          label: LabelEncode(
                              encoder: (tuple) =>
                                  Label(tuple['status'].toString())),
                          shape: ShapeEncode(
                              value: RectShape(
                            borderRadius:
                                const BorderRadius.all(Radius.circular(10)),
                          )),
                          color: ColorEncode(
                              variable: 'status', values: Defaults.colors10),
                          elevation: ElevationEncode(value: 5),
                          transition: Transition(
                              duration: Duration(seconds: 2),
                              curve: Curves.elasticOut),
                          entrance: {MarkEntrance.y},
                        )
                      ],
                      coord: PolarCoord(startRadius: 0.15),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.fromLTRB(20, 40, 20, 5),
                    child: const Text(
                      'Money in Circulation',
                      style: TextStyle(fontSize: 20,fontWeight: FontWeight.bold),textAlign: TextAlign.center,
                    ),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Expanded(
                        child: Container(
                          margin: const EdgeInsets.only(top: 10),
                          height: 300,
                          child: Chart(
                            rebuild: rebuild,
                            data: convertListToMapList(snapshot.data[0]
                                ["averageTransferAmountByType"]),
                            variables: {
                              'genre': Variable(
                                accessor: (Map map) =>
                                    map['TypeName'] as String,
                              ),
                              'amount': Variable(
                                accessor: (Map map) =>
                                    double.parse(map['TotalAmountTransferred']),
                              ),
                            },
                            marks: [
                              IntervalMark(
                                label: LabelEncode(
                                    encoder: (tuple) =>
                                        Label(tuple['amount'].toString())),
                                elevation: ElevationEncode(value: 0, updaters: {
                                  'tap': {true: (_) => 5}
                                }),
                                color: ColorEncode(
                                    value: Defaults.primaryColor,
                                    updaters: {
                                      'tap': {
                                        false: (color) => color.withAlpha(100)
                                      }
                                    }),
                                transition: Transition(
                                    duration: Duration(seconds: 2),
                                    curve: Curves.elasticOut),
                              )
                            ],
                            axes: [
                              Defaults.horizontalAxis,
                              Defaults.verticalAxis,
                            ],
                            selections: {'tap': PointSelection(dim: Dim.x)},
                            tooltip: TooltipGuide(),
                            crosshair: CrosshairGuide(),
                          ),
                        ),
                      ),
                      Expanded(
                        child: Container(
                          margin: const EdgeInsets.only(top: 10),
                          height: 300,
                          child: Chart(
                            rebuild: rebuild,
                            data: convertListToMapList(
                                snapshot.data[0]["AmountByCode"]),
                            variables: {
                              'genre': Variable(
                                accessor: (Map map) =>
                                    "${map['FromBudgetCode'].toString()}-${map['ToBudgetCode'].toString()}",
                              ),
                              'amount': Variable(
                                accessor: (Map map) => double.parse(
                                    map['TransferAmount'].toString()),
                              ),
                            },
                            marks: [
                              IntervalMark(
                                label: LabelEncode(
                                    encoder: (tuple) =>
                                        Label(tuple['amount'].toString())),
                                elevation: ElevationEncode(value: 0, updaters: {
                                  'tap': {true: (_) => 5}
                                }),
                                color: ColorEncode(
                                    value: Defaults.primaryColor,
                                    updaters: {
                                      'tap': {
                                        false: (color) => color.withAlpha(100)
                                      }
                                    }),
                                transition: Transition(
                                    duration: Duration(seconds: 2),
                                    curve: Curves.elasticOut),
                              )
                            ],
                            axes: [
                              Defaults.horizontalAxis,
                              Defaults.verticalAxis,
                            ],
                            selections: {'tap': PointSelection(dim: Dim.x)},
                            tooltip: TooltipGuide(),
                            crosshair: CrosshairGuide(),
                          ),
                        ),
                      ),
                      // Container(
                      //   margin: const EdgeInsets.only(top: 10),
                      //   width: 350,
                      //   height: 300,
                      //   child: Chart(
                      //     rebuild: rebuild,
                      //     data: convertListToMapList(
                      //         snapshot.data[0]["AmountByCode"]),
                      //     variables: {
                      //       'genre': Variable(
                      //         accessor: (Map map) => "${map['FromBudgetCode'].toString()}-${map['ToBudgetCode'].toString()}",
                      //       ),
                      //       'amount': Variable(
                      //         accessor: (Map map) => map['TransferCount'] as num,
                      //       ),
                      //     },
                      //     marks: [
                      //       IntervalMark(
                      //         label: LabelEncode(
                      //             encoder: (tuple) => Label(tuple['amount'].toString())),
                      //         elevation: ElevationEncode(value: 0, updaters: {
                      //           'tap': {true: (_) => 5}
                      //         }),
                      //         color:
                      //         ColorEncode(value: Defaults.primaryColor, updaters: {
                      //           'tap': {false: (color) => color.withAlpha(100)}
                      //         }),
                      //         transition: Transition(
                      //             duration: Duration(seconds: 2),
                      //             curve: Curves.elasticOut),
                      //       )
                      //     ],
                      //     axes: [
                      //       Defaults.horizontalAxis,
                      //       Defaults.verticalAxis,
                      //     ],
                      //     selections: {'tap': PointSelection(dim: Dim.x)},
                      //     tooltip: TooltipGuide(),
                      //     crosshair: CrosshairGuide(),
                      //   ),
                      // ),
                    ],
                  ),
                ],
              );
            }),
        floatingActionButton: RotationTransition(
          turns: _fabAnimation,
          child: FloatingActionButton(
            onPressed: _refreshData,
            child: const Icon(Icons.refresh),
          ),
        ),
      );
    }
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: Colors.white,
      body: FutureBuilder(
          future: fetchdata,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return Container(
                child: Center(child:   LoadingAnimationWidget.inkDrop(
                  color: Colors.blueAccent,
                  size: 30,
                )),
              );
            }
            if (!snapshot.hasData) {
              return Container(
                child: Center(child:   LoadingAnimationWidget.inkDrop(
                  color: Colors.blueAccent,
                  size: 30,
                )),
              );
            }
            return ListView(
              children: <Widget>[
                Container(
                  padding: const EdgeInsets.fromLTRB(20, 40, 20, 5),
                  child: const Text(
                    'Status Chart',
                    style: TextStyle(fontSize: 20),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.fromLTRB(10, 5, 10, 0),
                  alignment: Alignment.centerLeft,
                  child: const Text(
                    'በሁኔታ ላይ የተመሠረቱ ጥያቄዎች በመጠባበቅ ላይ, ውድቅ ተደርጓል, ጸድቋል.',
                  ),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    ...snapshot.data[0]["requestStats"].asMap().entries.map(
                        (entry) =>
                            AnimatedCard(index: entry.key, data: entry.value)),
                  ],
                ),
                Container(
                  margin: const EdgeInsets.only(top: 10),
                  width: 350,
                  height: 300,
                  child: Chart(
                    rebuild: rebuild,
                    data:
                        convertListToMapList(snapshot.data[0]["requestStats"]),
                    variables: {
                      'status': Variable(
                        accessor: (Map map) => map['RequestStatus'] as String,
                      ),
                      'value': Variable(
                        accessor: (Map map) => map['Count'] as num,
                        scale: LinearScale(min: 0, marginMax: 0.1),
                      ),
                    },
                    marks: [
                      IntervalMark(
                        label: LabelEncode(
                            encoder: (tuple) =>
                                Label(tuple['status'].toString())),
                        shape: ShapeEncode(
                            value: RectShape(
                          borderRadius:
                              const BorderRadius.all(Radius.circular(10)),
                        )),
                        color: ColorEncode(
                            variable: 'status', values: Defaults.colors10),
                        elevation: ElevationEncode(value: 5),
                        transition: Transition(
                            duration: Duration(seconds: 2),
                            curve: Curves.elasticOut),
                        entrance: {MarkEntrance.y},
                      )
                    ],
                    coord: PolarCoord(startRadius: 0.15),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.fromLTRB(20, 40, 20, 5),
                  child: const Text(
                    'Money in Circulation',
                    style: TextStyle(fontSize: 20),
                  ),
                ),
                Container(
                  margin: const EdgeInsets.only(top: 10),
                  height: 300,
                  child: Chart(
                    rebuild: rebuild,
                    data: convertListToMapList(
                        snapshot.data[0]["averageTransferAmountByType"]),
                    variables: {
                      'genre': Variable(
                        accessor: (Map map) => map['TypeName'] as String,
                      ),
                      'amount': Variable(
                        accessor: (Map map) =>
                            double.parse(map['TotalAmountTransferred']),
                      ),
                    },
                    marks: [
                      IntervalMark(
                        label: LabelEncode(
                            encoder: (tuple) =>
                                Label(tuple['amount'].toString())),
                        elevation: ElevationEncode(value: 0, updaters: {
                          'tap': {true: (_) => 5}
                        }),
                        color: ColorEncode(
                            value: Defaults.primaryColor,
                            updaters: {
                              'tap': {false: (color) => color.withAlpha(100)}
                            }),
                        transition: Transition(
                            duration: Duration(seconds: 2),
                            curve: Curves.elasticOut),
                      )
                    ],
                    axes: [
                      Defaults.horizontalAxis,
                      Defaults.verticalAxis,
                    ],
                    selections: {'tap': PointSelection(dim: Dim.x)},
                    tooltip: TooltipGuide(),
                    crosshair: CrosshairGuide(),
                  ),
                ),
                Container(
                  margin: const EdgeInsets.only(top: 10),
                  height: 300,
                  child: Chart(
                    rebuild: rebuild,
                    data:
                        convertListToMapList(snapshot.data[0]["AmountByCode"]),
                    variables: {
                      'genre': Variable(
                        accessor: (Map map) =>
                            "${map['FromBudgetCode'].toString()}-${map['ToBudgetCode'].toString()}",
                      ),
                      'amount': Variable(
                        accessor: (Map map) =>
                            double.parse(map['TransferAmount'].toString()),
                      ),
                    },
                    marks: [
                      IntervalMark(
                        label: LabelEncode(
                            encoder: (tuple) =>
                                Label(tuple['amount'].toString())),
                        elevation: ElevationEncode(value: 0, updaters: {
                          'tap': {true: (_) => 5}
                        }),
                        color: ColorEncode(
                            value: Defaults.primaryColor,
                            updaters: {
                              'tap': {false: (color) => color.withAlpha(100)}
                            }),
                        transition: Transition(
                            duration: Duration(seconds: 2),
                            curve: Curves.elasticOut),
                      )
                    ],
                    axes: [
                      Defaults.horizontalAxis,
                      Defaults.verticalAxis,
                    ],
                    selections: {'tap': PointSelection(dim: Dim.x)},
                    tooltip: TooltipGuide(),
                    crosshair: CrosshairGuide(),
                  ),
                )
              ],
            );
          }),
      floatingActionButton: RotationTransition(
        turns: _fabAnimation,
        child: FloatingActionButton(
          onPressed: _refreshData,
          child: const Icon(Icons.refresh),
        ),
      ),
    );
  }
}

class AnimatedCard extends StatefulWidget {
  final int index;
  final Map<String, dynamic> data;

  AnimatedCard({required this.index, required this.data});

  @override
  _AnimatedCardState createState() => _AnimatedCardState();
}

class _AnimatedCardState extends State<AnimatedCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration:
          const Duration(milliseconds: 1000), // Adjust the overall duration
    );
    _animation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(
          widget.index * 0.1, // Adjust the delay between cards
          1.0,
          curve: Curves.easeInOut,
        ),
      ),
    );

    // Trigger the animation when the widget is inserted into the tree
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  final colors = [Colors.green,Colors.red,Colors.yellow];
  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _animation,
      child: Card(
        color:  Defaults.colors10[widget.index % Defaults.colors10.length],
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            children: [
              Text(
                widget.data["RequestStatus"],
                style: TextStyle(color: Colors.white),
              ),
              Text(
                widget.data["Count"].toString(),
                style: TextStyle(color: Colors.white),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
