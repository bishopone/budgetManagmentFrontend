import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';
import 'package:http_parser/http_parser.dart'; // Import the http_parser package
import 'package:mime/mime.dart';

class PDFViewerModal extends StatefulWidget {
  final String token;
  final List<Map<String, dynamic>> transactions;
  final String selectedOption;
  final String fromDepartment;
  final String toDepartment;
  final String link;
  final String type;
  final List<dynamic> pictures;
  final VoidCallback onFinish;

  PDFViewerModal({
    required this.token,
    required this.transactions,
    required this.selectedOption,
    required this.fromDepartment,
    required this.toDepartment,
    required this.link,
    required this.pictures,
    required this.onFinish, required this.type,
  });

  @override
  _PDFViewerModalState createState() => _PDFViewerModalState();
}

class _PDFViewerModalState extends State<PDFViewerModal> {
  late Uint8List _pdfBytes = Uint8List(0); // Initialize with an empty list
  late PdfViewerController _pdfViewerController;
  double zoomlevel = 1;
  @override
  void initState() {
    super.initState();
    _pdfViewerController = PdfViewerController();
    _generatePDF();
  }

  Future<void> _generatePDF() async {
    var totalAmount = widget.transactions.fold(
      0.0,
          (amount, transaction) => amount + (transaction["amount"] as double),
    );
    List<String> TempImage = [];
    final url = Uri.parse('${widget.link}/pdf/view_Pdf');
    final request = http.MultipartRequest('POST', url);
    widget.pictures.forEach((value) async {
      value['pics'].forEach((image) async {

        // final image = value['pics'];
        print("imageimageimageimage");
        print(image);
        var addDt = DateTime.now();
        print(image);
        if (image.startsWith('http')) {
          TempImage.add(image);
        } else {
          // If the image is a local file path, add it directly to the request
          var file = File(image);
          var mimeType =
              lookupMimeType(file.path); // Determine MIME type dynamically
          var multipartFile = await http.MultipartFile.fromPath(
            'attachment',
            file.path,
            filename: 'attachment_${addDt}_${image}',
            contentType: MediaType.parse(mimeType!),
          );
          request.files.add(multipartFile);
        }
      });
    });

    print("jsonEncode(widget.transactions)");
    print(jsonEncode(widget.transactions));
    request.fields.addAll({
      "RequestFor": widget.selectedOption,
      "BudgetTypeID": widget.type,
      "RequestStatus": "Pending",
      "From": widget.fromDepartment.split(':')[0],
      "To": widget.toDepartment.split(':')[0],
      "TempImage": jsonEncode(TempImage),
      "Transaction": jsonEncode(widget.transactions),
      "Type": widget.type,
      "Amount": totalAmount.toString(),
    });

    // Set headers including the authorization header
    request.headers['Authorization'] = 'Bearer ${widget.token}';

    // Send the request
    final streamedResponse = await request.send();

    if (streamedResponse.statusCode == 200) {
      // Read the response stream and accumulate bytes
      final List<int> bytes = [];
      await streamedResponse.stream.forEach((chunk) {
        bytes.addAll(chunk);
      });
      final Uint8List pdfBytes = Uint8List.fromList(bytes);

      setState(() {
        _pdfBytes = pdfBytes;
      });
    } else {
      // Handle error
      print('Failed to generate PDF: ${streamedResponse.statusCode}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      content: Container(
        height: MediaQuery.of(context).size.height * 0.7,
        width: MediaQuery.of(context).size.width * 0.9,
        child: _pdfBytes.isNotEmpty
            ? SfPdfViewer.memory(
          _pdfBytes,
          controller: _pdfViewerController,
        )
            : Center(
          child: CircularProgressIndicator(),
        ),
      ),
      actions: [
        IconButton(
          icon: Icon(Icons.zoom_in),
          onPressed: () {
      _pdfViewerController.zoomLevel = (zoomlevel + 0.1);
      zoomlevel = zoomlevel + 0.1;
          },
        ),
        IconButton(
          icon: Icon(Icons.zoom_out),
          onPressed: () {
              _pdfViewerController.zoomLevel = (zoomlevel - 0.1);
              zoomlevel = zoomlevel - 0.1;

          },
        ),
        IconButton(
          icon: Icon(Icons.navigate_before),
          onPressed: () {
            _pdfViewerController.previousPage();
          },
        ),
        IconButton(
          icon: Icon(Icons.navigate_next),
          onPressed: () {
            _pdfViewerController.nextPage();
          },
        ),
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
            widget.onFinish();
          },
          child: Text('Finish'),
        ),
      ],
    );
  }
}
