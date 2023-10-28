import 'dart:typed_data';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_signaturepad/signaturepad.dart';

class SignatureCaptureWidget extends StatefulWidget {
  final Function onSubmit;

  SignatureCaptureWidget({required this.onSubmit});

  @override
  _SignatureCaptureWidgetState createState() => _SignatureCaptureWidgetState();
}

class _SignatureCaptureWidgetState extends State<SignatureCaptureWidget> {
  final GlobalKey<SfSignaturePadState> _signaturePadKey = GlobalKey<SfSignaturePadState>();

  Future<void> _onSubmit() async {
    final signatureImage = await _signaturePadKey.currentState!.toImage(pixelRatio: 3.0);
    final signatureBytes = await signatureImage.toByteData(format: ImageByteFormat.png);
    final Uint8List signatureUint8List = signatureBytes!.buffer.asUint8List();
    widget.onSubmit(signatureUint8List); // Pass the Uint8List to the parent widget
  }

  void _clearSignature() {
    // Clear the signature pad
    _signaturePadKey.currentState!.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        // Signature Pad
        Container(
          height: 200,
          child: SfSignaturePad(
            key: _signaturePadKey,
            backgroundColor: Colors.white,
          ),
        ),
        SizedBox(height: 20),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ElevatedButton(
              onPressed: _clearSignature,
              child: Text('Clear'),
            ),
            SizedBox(width: 20),
            ElevatedButton(
              onPressed: _onSubmit,
              child: Text('Submit'),
            ),
          ],
        ),
      ],
    );
  }
}