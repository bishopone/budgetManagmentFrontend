import 'package:flutter/material.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

class SuccessAlertDialog extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
      backgroundColor: Colors.transparent,
      elevation: 0,
      content: Container(
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.green,
          borderRadius: BorderRadius.circular(10.0),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.check_circle, color: Colors.white, size: 64),
            SizedBox(height: 16),
            Text(
              'Success!',
              style: TextStyle(color: Colors.white, fontSize: 18),
            ),
          ],
        ),
      ),
    );
  }
}

class ErrorAlertDialog extends StatelessWidget {
  final String message;
  final VoidCallback? onRetry;

  ErrorAlertDialog({required this.message, this.onRetry});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
      backgroundColor: Colors.transparent,
      elevation: 0,
      content: Container(
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.red,
          borderRadius: BorderRadius.circular(10.0),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.error_outline, color: Colors.white, size: 64),
            SizedBox(height: 16),
            Text(
              'Error',
              style: TextStyle(color: Colors.white, fontSize: 18),
            ),
            SizedBox(height: 8),
            Text(
              message,
              style: TextStyle(color: Colors.white),
            ),
            SizedBox(height: 16),
            if (onRetry != null)
              ElevatedButton(
                onPressed: onRetry,
                child: Text('Try Again',style: TextStyle(color: Colors.white),),
              ),
          ],
        ),
      ),
    );
  }
}
class LoadingDialog extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
      backgroundColor: Colors.transparent,
      elevation: 0,
      content: Container(
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10.0),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            LoadingAnimationWidget.fourRotatingDots(
              color: Colors.lightBlueAccent,
              size: 40,
            ),            SizedBox(height: 16),
            Text(
              'Loading...',
              style: TextStyle(fontSize: 18),
            ),
          ],
        ),
      ),
    );
  }
}
Future<void> showSuccessDialog(BuildContext context) async {
  return showDialog(
    context: context,
    builder: (context) {
      return AnimatedContainer(
        duration: Duration(milliseconds: 500),
        curve: Curves.easeInOut,
        child: SuccessAlertDialog(),
      );
    },
  );
}

Future<void> showErrorDialog(BuildContext context, String message, VoidCallback? onRetry) async {
  return showDialog(
    context: context,
    builder: (context) {
      return AnimatedContainer(
        duration: Duration(milliseconds: 500),
        curve: Curves.easeInOut,
        child: ErrorAlertDialog(
          message: message,
          onRetry: onRetry,
        ),
      );
    },
  );
}
Future<void> showLoadingDialog(BuildContext context) async {
  return showDialog(
    context: context,
    barrierDismissible: false, // Prevent the user from dismissing the dialog
    builder: (context) {
      return WillPopScope(
        onWillPop: () async => false, // Disable back button during loading
        child: LoadingDialog(),
      );
    },
  );
}