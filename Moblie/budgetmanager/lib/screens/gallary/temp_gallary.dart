import 'package:cunning_document_scanner/cunning_document_scanner.dart';
import 'package:dotted_border/dotted_border.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:http_parser/http_parser.dart';

import '../../config.dart'; // Import the AppConfigProvider

class DocumentScannerScreen extends StatefulWidget {
  @override
  _DocumentScannerScreenState createState() => _DocumentScannerScreenState();
}

class _DocumentScannerScreenState extends State<DocumentScannerScreen> {
  Future<List<dynamic>> fetchImages() async {
    const secureStorage = FlutterSecureStorage();
    final token = await secureStorage.read(key: "token");
    final headers = {
      "Content-Type": "application/json",
      'Authorization': 'Bearer $token',
    };
    final appConfig = AppConfigProvider.of(context)?.appConfig;
    final url = Uri.parse('${appConfig?.apiBaseUrl}/temporaryattachment');

    var response = await http.get(
      url,
      headers: headers,
    );

    if (response.statusCode == 200) {
      var data = json.decode(response.body);
      for (int index = 0; index < data.length; index++) {
        String filePath = data[index]['FilePath'];
        filePath = filePath.replaceAll('\\', '/');
        data[index]['webpath'] = '${appConfig?.apiBaseUrl}/$filePath';
      }
      return data;
    } else {
      throw Exception('Failed to fetch images: ${response.statusCode}');
    }
  }

  Future<void> addImageUsingScanner() async {
    List<String> pictures;
    try {
      pictures = await CunningDocumentScanner.getPictures() ?? [];
      if (!mounted) return;
      const secureStorage = FlutterSecureStorage();
      final token = await secureStorage.read(key: "token");
      final appConfig = AppConfigProvider.of(context)?.appConfig;
      final url = Uri.parse('${appConfig?.apiBaseUrl}/temporaryattachment');
      final request = http.MultipartRequest('POST', url);
      pictures.forEach((image) async {
        var addDt = DateTime.now();
        var multipartFile = await http.MultipartFile.fromPath(
          'temporaryattachment',
          image,
          contentType: MediaType('image', 'png'),
          filename: 'attachment_${addDt}_${image.replaceAll(".jpg", "")}.png',
        );
        request.files.add(multipartFile);
      });
      request.headers['Authorization'] = 'Bearer $token';
      final response = await request.send();
      if (response.statusCode == 200) {
        setState(() {});
      }
    } catch (exception) {
      // Handle exception here
    }
  }

  Future<void> deleteImage(int id) async {
    const secureStorage = FlutterSecureStorage();
    final token = await secureStorage.read(key: "token");
    final headers = {
      "Content-Type": "application/json",
      'Authorization': 'Bearer $token',
    };
    final appConfig = AppConfigProvider.of(context)?.appConfig;
    final url = Uri.parse('${appConfig?.apiBaseUrl}/temporaryattachment/$id');

    var response = await http.delete(
      url,
      headers: headers,
    );

    if (response.statusCode == 200) {
      setState(() {});
    } else {
      throw Exception('Failed to delete image: ${response.statusCode}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('የሰነድ ስካነር',style: TextStyle(color: Colors.black),),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            InkWell(
              onTap: addImageUsingScanner,
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
              height: 10,
            ),
            Expanded(
              child: FutureBuilder<List<dynamic>>(
                future: fetchImages(),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
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
                      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
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
                                    child: Image.network(
                                      fileUrl,
                                      fit: BoxFit.contain,
                                    ),
                                  ),
                                );
                              },
                            );
                          },
                          onLongPress: () {
                            showDialog(
                              context: context,
                              builder: (BuildContext context) {
                                return AlertDialog(
                                  title: Text('Delete Image?'),
                                  content: Text(
                                      'Are you sure you want to delete this image?'),
                                  actions: <Widget>[
                                    TextButton(
                                      onPressed: () {
                                        Navigator.of(context).pop();
                                      },
                                      child: Text('Cancel'),
                                    ),
                                    TextButton(
                                      onPressed: () {
                                        deleteImage(images[index]['Id']);
                                        Navigator.of(context).pop();
                                      },
                                      child: Text('Delete'),
                                    ),
                                  ],
                                );
                              },
                            );
                          },
                          child: Image.network(
                            fileUrl,
                            fit: BoxFit.cover,
                          ),
                        );
                      },
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
