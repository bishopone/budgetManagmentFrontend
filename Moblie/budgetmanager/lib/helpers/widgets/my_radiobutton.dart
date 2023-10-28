import 'package:flutter/material.dart';

class RadioWidget extends StatelessWidget {
  final String selectedOption;
  final Function(String) setSelectedOption;

  RadioWidget({required this.selectedOption, required this.setSelectedOption});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: <Widget>[
        Column(
          children: [
            Container(
              width: 100.0, // Adjust the width as needed
              child: const Text("Own", textAlign: TextAlign.center),
            ),
            Radio(
              value: "own",
              groupValue: selectedOption,
              onChanged: (value) {
                setSelectedOption(value!);
              },
            ),
          ],
        ),
        Column(
          children: [
            Container(
              width: 100.0, // Adjust the width as needed
              child: const Text("Other", textAlign: TextAlign.center),
            ),
            Radio(
              value: "other",
              groupValue: selectedOption,
              onChanged: (value) {
                setSelectedOption(value!);
              },
            ),
          ],
        ),
      ],
    );
  }
}
