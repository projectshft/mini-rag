// Helpers for binary trees. You don't need to change this file.
//
// A node is an object with a value, a left and a right. left and right are
// child nodes, or null when there is no child on that side.
//
//        2
//       / \
//      1   3
//
//   new TreeNode(2, new TreeNode(1), new TreeNode(3))
//
// Your functions get plain objects with value, left and right. Our tests may
// build nodes without this class, so only rely on those three properties.
class TreeNode {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

// fromArray builds a tree from its values read row by row, left to right,
// with null where a node is missing. It gives back the root, or null.
//
// fromArray([2, 1, 3]) is the tree drawn above.
// fromArray([1, null, 2]) is 1 with only a right child, 2.
function fromArray(values) {
  if (values.length === 0 || values[0] === null) return null;
  const root = new TreeNode(values[0]);
  const waiting = [root];
  let front = 0;
  let i = 1;
  while (i < values.length && front < waiting.length) {
    const parent = waiting[front];
    front++;
    if (i < values.length && values[i] !== null) {
      parent.left = new TreeNode(values[i]);
      waiting.push(parent.left);
    }
    i++;
    if (i < values.length && values[i] !== null) {
      parent.right = new TreeNode(values[i]);
      waiting.push(parent.right);
    }
    i++;
  }
  return root;
}

// toArray is the opposite of fromArray: the values row by row, with null
// for missing nodes, and no nulls left over at the end.
function toArray(root) {
  const out = [];
  const waiting = [root];
  let front = 0;
  while (front < waiting.length) {
    const node = waiting[front];
    front++;
    if (node === null) {
      out.push(null);
    } else {
      out.push(node.value);
      waiting.push(node.left, node.right);
    }
  }
  while (out.length > 0 && out[out.length - 1] === null) out.pop();
  return out;
}

module.exports = { TreeNode, fromArray, toArray };
