import 'package:flutter/material.dart';

class InformationScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Get the arguments passed to this route
    final Map<String, dynamic>? args = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;

    if (args != null && args.containsKey("title")) {
      final String title = args["title"];
      return Scaffold(
          appBar: AppBar(
            centerTitle: true,
            title: Text(title, style: const TextStyle(color: Colors.black),),
          ),
          body:const Column() // Your screen content here
      );
    } else {
      // Handle the case when arguments are missing or not in the expected format.
      return Scaffold(
        appBar: AppBar(
          title: const Text("Somthing is Wrong On Ous Side "),
        ),
        body: const Center(
          child: Text("Try Again Later"),
        ),
      );
    }
  }
}
