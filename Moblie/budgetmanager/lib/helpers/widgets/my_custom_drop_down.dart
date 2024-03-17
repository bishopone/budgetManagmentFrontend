import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:animated_tree_view/animated_tree_view.dart';

import '../../models/department_code.dart';
class TreeViewComponent extends StatefulWidget {
  const TreeViewComponent({
    Key? key,
    required this.choices,
    required this.choiceSetter,
    required this.description,
    required this.fetchFunction,
    required this.selectedOption,
  }) : super(key: key);

  final String description;
  final String choices;
  final String selectedOption;
  final Function(String) choiceSetter;
  final Future<List<BudgetHierarchy>> Function() fetchFunction;

  @override
  _TreeViewComponentState createState() => _TreeViewComponentState();
}

class _TreeViewComponentState extends State<TreeViewComponent> {
  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<BudgetHierarchy>>(
      future: widget.fetchFunction(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return Center(child: Text('No data available'));
        } else {
          final List<BudgetHierarchy> data = snapshot.data!;
          final TreeNode sampleTree = convertToTreeNodes(data);

          return Column(
            children: [
              Expanded(
                child: TreeView.simple(
                  tree: sampleTree,
                  showRootNode: true,
                  expansionIndicatorBuilder: (context, node) =>
                      ChevronIndicator.rightDown(
                        tree: node,
                        color: Colors.blue[700],
                        padding: const EdgeInsets.all(8),
                      ),
                  indentation: const Indentation(style: IndentStyle.squareJoint),
                  onItemTap: (item) {
                    if (kDebugMode) print("Item tapped: ${item.key}");
                    widget.choiceSetter(item.key);
                  },
                  onTreeReady: (controller) {
                    controller.expandAllChildren(sampleTree);
                  },
                  builder: (context, node) {
                    return Card(
                      color: Colors.blue[node.level.clamp(0, 9)],
                      child: ListTile(
                        title: node.data,
                        subtitle: Text('ID: ${node.key}'),
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        }
      },
    );
  }

  TreeNode convertToTreeNodes(List<BudgetHierarchy> data) {
    TreeNode root = TreeNode.root(data: Text(widget.description));

    void addNodes(TreeNode parentNode, List<BudgetHierarchy> items) {
      for (var item in items) {
        TreeNode node = TreeNode(
          key: item.id,
          data: Text(item.name),
        );
        if (item.children != null) {
          addNodes(node, item.children!);
        }
        parentNode.add(node);
      }
    }

    addNodes(root, data);

    return root;
  }
}
