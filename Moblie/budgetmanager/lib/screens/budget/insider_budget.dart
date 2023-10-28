import 'package:flutter/material.dart';

class InsiderBudget extends StatefulWidget {
  const InsiderBudget({Key? key}) : super(key: key);

  @override
  State<InsiderBudget> createState() => _InsiderBudgetState();
}

class _InsiderBudgetState extends State<InsiderBudget> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),

      body: Center(child: Text("Insider Budget"),),
    );
  }
}
