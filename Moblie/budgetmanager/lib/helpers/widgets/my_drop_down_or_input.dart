import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../../config.dart';
import '../../models/budget_code.dart';
import '../../screens/budget/capital_budget.dart';
import 'my_drop_down_option.dart';

class DropdownOrInputField extends StatefulWidget {
  const DropdownOrInputField({super.key, required this.setReason});

  @override
  _DropdownOrInputFieldState createState() => _DropdownOrInputFieldState();
  final setReason;
}
class _DropdownOrInputFieldState extends State<DropdownOrInputField> {
  bool useDropdown = true; // Flag to switch between dropdown and input

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Switch(
              value: useDropdown,
              onChanged: (newValue) {
                setState(() {
                  useDropdown = newValue;
                });
              },
            ),
            if (useDropdown)
              Expanded(
                child: DropDownOption(
                  setSelectedOption: (str) => {widget.setReason(str)},
                  selectedOption: 'reason',
                  description: "Choose a reason",
                  fetchFunction: (String filter) async {
                    final appConfig = AppConfigProvider
                        .of(context)
                        ?.appConfig;
                    print('${appConfig?.apiBaseUrl}/budgetcode');
                    final url =
                    Uri.parse('${appConfig?.apiBaseUrl}/budgetcode');
                    final response = await http.get(
                      url,
                      headers: {"Content-Type": "application/json"},
                    );
                    var data = json.decode(response.body);
                    var models = BudgetCode.fromJsonList(data);
                    return models
                        .map((e) => "${e.id} : ${e.description}")
                        .toList();
                  },
                ),
              )
            else
              Expanded(
                child: TextField(

                  decoration: const InputDecoration(
                    labelText: 'Enter text',
                  ),
                  onChanged: (value) {
                    widget.setReason(value);
                  },
                ),
              ),
          ],
        ),
      ],
    );
  }
}
