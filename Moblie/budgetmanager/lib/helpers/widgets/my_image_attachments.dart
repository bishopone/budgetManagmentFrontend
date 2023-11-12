import 'package:flutter/material.dart';
import 'dart:io';

class ImageWidget extends StatefulWidget {
  const ImageWidget({super.key, required this.pictures});

  @override
  _ImageWidgetState createState() => _ImageWidgetState();
  final pictures;
}

class _ImageWidgetState extends State<ImageWidget> {
  // List<String> _pictures = ["image1.jpg", "image2.jpg"]; // Replace with your image paths
  int selectedImageIndex = -1;

  void handleViewButtonPress() {
    // Display the selected image in large mode using a dialog
    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          child: Image.file(
            File(
              widget.pictures[selectedImageIndex],
            ),
          ),
        );
      },
    );
  }

  void handleDeleteButtonPress() {
    // TODO: Remove the selected image
    setState(() {
      widget.pictures.removeAt(selectedImageIndex);
      selectedImageIndex = -1; // Reset selected image index
    });
  }

  @override
  Widget build(BuildContext context) {
    return  Row(
      children: [
        for (var i = 0; i < widget.pictures.length; i++)
          GestureDetector(
            onTap: () {
              setState(() {
                selectedImageIndex = i;
              });
            },
            child: Stack(
              children: [
                Image.file(
                  File(widget.pictures[i]),
                  width: 100,
                  height: 100,
                ),
                Positioned(
                  left: 25,
                  child: Center(
                    child: Visibility(
                      visible: selectedImageIndex == i,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          IconButton(
                            color: Colors.green,
                            icon: const Icon(Icons.remove_red_eye),
                            onPressed: handleViewButtonPress,
                          ),
                          IconButton(
                            color: Colors.red,
                            icon: const Icon(Icons.delete),
                            onPressed: handleDeleteButtonPress,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}
