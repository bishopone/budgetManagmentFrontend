import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
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
    required this.type,
  }) : super(key: key);

  final String description;
  final String choices;
  final String selectedOption;
  final String type;
  final Function(String) choiceSetter;
  final Future<List<BudgetHierarchy>> Function() fetchFunction;

  @override
  _TreeViewComponentState createState() => _TreeViewComponentState();
}

class _TreeViewComponentState extends State<TreeViewComponent> {
  TreeViewController? _controller;

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
                  expansionBehavior: ExpansionBehavior.scrollToLastChild,
                  tree: sampleTree,
                  showRootNode: false,
                  expansionIndicatorBuilder: (context, node) =>
                      ChevronIndicator.rightDown(
                    tree: node,
                    color: Colors.blue[700],
                    padding: const EdgeInsets.all(8),
                  ),
                  indentation:
                      const Indentation(style: IndentStyle.squareJoint),
                  onTreeReady: (controller) {
                    _controller = controller;
                  },
                  builder: (context, node) {
                    return Card(
                      color: Colors.blue[node.level.clamp(0, 9)],
                      child: ListTile(
                          title: node.data["name"],
                          subtitle: Text('ID: ${node.key}'),
                          trailing: widget.type == "capital"  ? node.data["type"] == 'capital'? TextButton(
                                  onPressed: () {
                                    widget.choiceSetter(node.key);
                                  },
                                  child: Text("SELECT"),
                                ):null
                              : node.data["isSelectable"]
                                  ? TextButton(
                                      onPressed: () {
                                        widget.choiceSetter(node.key);
                                      },
                                      child: Text("SELECT"),
                                    )
                                  : null),
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
        print(item.isSelectable);
        TreeNode node = TreeNode(
          key: item.id,
          data: {
            "name": Text(item.name),
            "isSelectable": item.isSelectable == 1 ? true : false,
            "type": item.Type
          },
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
