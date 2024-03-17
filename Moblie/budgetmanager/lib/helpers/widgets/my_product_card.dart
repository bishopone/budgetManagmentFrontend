import 'package:dotted_border/dotted_border.dart';
import 'package:flutter/material.dart';

import 'my_image_attachments.dart';

class DocumentCard extends StatefulWidget {
  const DocumentCard(
      {super.key, this.fetchImages, this.onPressed, this.pictures, this.index});
  final fetchImages;
  final onPressed;
  final index;
  final pictures;

  @override
  State<DocumentCard> createState() => _DocumentCardState();
}

class _DocumentCardState extends State<DocumentCard> {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          children: [
            Card(
              semanticContainer: true,
              clipBehavior: Clip.antiAliasWithSaveLayer,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  ImageWidget(
                    pictures: widget.pictures['pics'],
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      InkWell(
                        onTap: () => widget.onPressed(widget.index) ,
                        child: DottedBorder(
                          color: Colors.black,
                          strokeWidth: 2,
                          dashPattern: const [
                            5,
                            5,
                          ],
                          child: Container(
                              padding: const EdgeInsets.all(16.0),
                              child: const Icon(Icons.image)),
                        ),
                      ),
                      SizedBox(
                        width: 5,
                      ),
                      InkWell(
                        onTap: () {
                          showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              return Dialog(
                                child: FutureBuilder<List<dynamic>>(
                                  future: widget.fetchImages(),
                                  builder: (context, snapshot) {
                                    if (snapshot.connectionState ==
                                        ConnectionState.waiting) {
                                      return Center(
                                        child: CircularProgressIndicator(),
                                      );
                                    } else if (snapshot.hasError) {
                                      return Center(
                                        child: Text('Error: ${snapshot.error}'),
                                      );
                                    } else {
                                      List<dynamic> images = snapshot.data ?? [];
                                      return GridView.builder(
                                        gridDelegate:
                                        SliverGridDelegateWithFixedCrossAxisCount(
                                          crossAxisCount: 3,
                                          crossAxisSpacing: 4.0,
                                          mainAxisSpacing: 4.0,
                                        ),
                                        itemCount: images.length,
                                        itemBuilder: (context, index) {
                                          String fileUrl = images[index]['webpath'];
                                          return GestureDetector(
                                            onTap: () {
                                              showDialog(
                                                context: context,
                                                builder: (BuildContext context) {
                                                  return Dialog(
                                                    child: Container(
                                                      width: MediaQuery.of(context)
                                                          .size
                                                          .width *
                                                          0.8,
                                                      child: Image.network(
                                                        fileUrl,
                                                        fit: BoxFit.contain,
                                                      ),
                                                    ),
                                                  );
                                                },
                                              );
                                            },
                                            child: Stack(
                                              children: [
                                                Image.network(
                                                  fileUrl,
                                                  fit: BoxFit.cover,
                                                ),
                                                Positioned(
                                                    top: 0,
                                                    left: 0,
                                                    child: Container(
                                                      color: Colors.white,
                                                      child: IconButton(
                                                        icon: Icon(Icons.add),
                                                        iconSize: 20,
                                                        color: Colors.green,
                                                        onPressed: () {
                                                          setState(() {
                                                            widget.pictures['pics']
                                                                .add(fileUrl);
                                                          });
                                                        },
                                                      ),
                                                    ))
                                              ],
                                            ),
                                          );
                                        },
                                      );
                                    }
                                  },
                                ),
                              );
                            },
                          );
                        },
                        child: DottedBorder(

                          color: Colors.black,
                          strokeWidth: 2,
                          dashPattern: const [
                            5,
                            5,
                          ],
                          child: Container(
                              padding: const EdgeInsets.all(16.0),
                              child: const Icon(Icons.phone_android)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(
                    height: 10,
                  ),
                    Text(widget.pictures['Name'],style: const TextStyle(fontWeight: FontWeight.bold)),
                  SizedBox(
                      width: 100,
                      child: Text(widget.pictures['Description'],style: const TextStyle(fontWeight: FontWeight.bold)))

                ],
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10.0),
              ),
              elevation: 5,
              margin: EdgeInsets.all(10),
            ),
            const SizedBox(
              height: 10,
            ),
          ],
        ),
      ),
    );
  }
}
