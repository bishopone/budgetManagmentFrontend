import 'dart:convert';

import 'package:budgetmanager/models/reject_reason.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../../config.dart';
import '../../models/budget_code.dart';
import '../../screens/budget/capital_budget.dart';
import 'my_drop_down_option.dart';

class DropdownOrInputField extends StatefulWidget {
  const DropdownOrInputField({super.key, required this.setReason, required this.index});

  @override
  _DropdownOrInputFieldState createState() => _DropdownOrInputFieldState();
  final setReason;
  final index;
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
                  setSelectedOption: (str) => {widget.setReason(str, widget.index)},
                  selectedOption: 'reason',
                  description: "Choose a reason",
                  fetchFunction: (String filter) async {
                    final appConfig = AppConfigProvider
                        .of(context)
                        ?.appConfig;
                    print('${appConfig?.apiBaseUrl}/reject-reasons/1');
                    final url =
                    Uri.parse('${appConfig?.apiBaseUrl}/reject-reasons/1');
                    final response = await http.get(
                      url,
                      headers: {"Content-Type": "application/json"},
                    );
                    var data = json.decode(response.body);
                    var models = RejectReason.listFromJson(data);
                    return models
                        .map((e) => e.reason)
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
                    widget.setReason(value,  widget.index);
                  },
                ),
              ),
          ],
        ),
      ],
    );
  }
}
