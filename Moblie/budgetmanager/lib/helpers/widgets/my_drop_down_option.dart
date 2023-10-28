import 'package:dropdown_search/dropdown_search.dart';
import 'package:flutter/material.dart';
class DropDownOption extends StatelessWidget {
  const DropDownOption({Key? key,
    required this.selectedOption,
    required this.setSelectedOption,
    required this.description,
    required this.fetchFunction})
      : super(key: key);
  final String description;
  final String selectedOption;
  final Function(String) setSelectedOption;
  final Future<List<String>> Function(String) fetchFunction;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(12.0),
      child: Column(
        children: [
          DropdownSearch<String>(
            onChanged: (x) => setSelectedOption(x!),
            dropdownDecoratorProps: DropDownDecoratorProps(
                dropdownSearchDecoration: InputDecoration(
                    label: Text(
                      description,
                      style: const TextStyle(color: Colors.black),
                    ))),
            asyncItems: fetchFunction,
            popupProps: PopupProps.menu(
              showSearchBox: true,
              fit: FlexFit.loose,
              searchFieldProps: TextFieldProps(
                  decoration: InputDecoration(
                      hintText: description,
                      hintStyle: const TextStyle(color: Colors.black))),
              menuProps: const MenuProps(
                backgroundColor: Colors.transparent,
                elevation: 1,
              ),
              containerBuilder: (ctx, popupWidget) {
                return Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Flexible(
                      child: Container(
                        decoration: const BoxDecoration(
                          borderRadius: BorderRadius.all(Radius.circular(5)),
                          color: Colors.white,
                        ),
                        child: popupWidget,
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
