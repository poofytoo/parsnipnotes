/*
 *JSON Schema
 *node:
 *{
 *  _id: "/owner/folder/file"
 *  
 *  // Data Entries
 *  title: "myTitle"
 *  content: "this is a great content!"
 *  nodeLevel: 0 (chunk), 3 (section/chapter), 6 (unit), 9 (class/book/packet)
 *  _children: [ tree structure ]
 *
 *  // Other Stuff
 *}
 *
 *tree:
 *{
 *  _id: id of child
 *  nodeLevel: same
 *  _children: [ tree structure ]
 *}
 */

var databaseUrl = "notely";
var collections = ["nodes"]
var db = require("mongojs").connect(databaseUrl, collections);

db.nodes.ensureIndex({_nodeLevel: 1});

/*
db.chunks.save({email: "srirangan@gmail.com", password: "iLoveMongo", sex: "male"}, function(err, saved) {
  if( err || !saved ) console.log("User not saved");
  else console.log("User saved");
});

db.chunks.find({sex: "male"}, function(err, users) {
  if( err || !users) console.log("No male users found");
  else users.forEach( function(femaleUser) {
    console.log(femaleUser);
  } );
});
*/

/* DEPRECATED
exports.addLinearChildren = function(root, leafArray, where) {
  // Construct the tree
  db.nodes.findOne({_id:root}, function (err, node) {
    if (err || !node) {
      console.log("Could not find: " + root);
    } else {
      
      var branch;
      
      if (where && root !== where) {
        var curr = [node];
        
        search_loop: while (curr.length) {
          // Do a depth-first search, since most trees will be linear
          var test = curr.pop();
          console.log(test);
          for (var i = test.children.length; --i >= 0; ) {
            if (test.children[i]._id === where) {
              branch = test.children[i];
              break search_loop;
            } else {
              if (test.children[i].children.length > 0) {
                curr.push(test.children[i]);
              }
            }
          }
        }
        
        if (!branch) {
          console.log("Could not find " + where);
          return;
        }
      } else {
        branch = node;
      }
      
      for (var i in leafArray) {
        var leaf = {_id:leafArray[i], children:[]};
        branch.children.push(leaf);
        branch = leaf;
      }
      
      db.nodes.update({_id:root}, {$set: {children: node.children}});
    }
  });
}
*/

/**
 *flattenNode takes a node array then returns the linearized version. Only
 *primary children are expanded and no formatting is kept.
 */
/* DEPRECATED
exports.linearizeNode = function(root, callback) {
  db.nodes.findOne({_id:root}, function (err, node) {
    if (err || !node) {
      console.log("Could not find: " + root);
      callback();
    } else {
      var ret = node.title + "\n" + node.content;
      
      if (node.children.length > 0) {
        var flatten = [node.children[0]._id];
        var branch = node;
        while (branch.children.length > 0) {
          branch = branch.children[0];
          flatten.push(branch._id);
        }
        console.log(flatten);
        
        db.nodes.find({_id:{$in: flatten}}, function (err, nodes) {
          if (err || !nodes) {
            console.log("no nodes found");
          } else {
            nodes.forEach(function (node) {
              ret += node.title + "\n" + node.content;
            });
            callback(ret);
          }
        });
      } else {
        callback(ret);
      }
    }
  });
}
*/

var hi;

/**
 *Takes a linear set of children and turns it into a child tree based on nodelevel. Bad things happen if the root isn't found.
 */
exports.setChildren = function(id, childrenIDs) {
  var lookup = [id].concat(childrenIDs);
  db.nodes.find({_id:{$in: lookup}}, function (err, sortedNodes) {
    if (err || !sortedNodes) {
      console.log('Could not setChildren()');
    } else {
      var nodes = {};
      for (var i in sortedNodes) {
        nodes[sortedNodes[i]._id] = sortedNodes[i];
      }
      var root = { _children: [], nodeLevel: nodes[id].nodeLevel };
      var branch = root;
      var leaf = branch;
      var path = [];
      var rootLevel = nodes[id].nodeLevel;
      var nodeLevel = nodes[id].nodeLevel;
      for (var i in childrenIDs) {
        var nextLevel = nodes[childrenIDs[i]].nodeLevel;
        if (nextLevel >= rootLevel) {
          console.log("Bad nodeLevel tree: splitting not implemented yet");
          return;
        }
        
        if (nextLevel > nodeLevel) {
          // The next node goes back up, so go up the path until it can be appended again
          while ((branch = path.pop()).nodeLevel < nextLevel){
            leaf = branch;
            console.log(branch._id);
          }
          console.log(branch._id);
          leaf = branch;
          nodeLevel = branch.nodeLevel;
        }
        
        if (nextLevel < nodeLevel) {
          // The next node is a child node, the leaf becomes the branch then the new leaf is appended
          path.push(branch);
          branch = leaf;
          leaf = { _id: nodes[childrenIDs[i]]._id, nodeLevel: nextLevel, _children: [] };
          branch._children.push(leaf);
        } else if (nextLevel == nodeLevel) {
          // The next node is a sibling node, the branch grows another leaf
          leaf = { _id: nodes[childrenIDs[i]]._id, nodeLevel: nextLevel, _children: [] };
          branch._children.push(leaf);
        }
        
        nodeLevel = nextLevel;
      }
      
      db.nodes.update({_id:id}, {$set: {_children:root._children}});
    }
  });
}

/**
 *Updates the fields of a node with {<key>:<value>} pairs. Please do not edit fields starting with underscores.
 */
exports.updateNode = function(id, values) {
  db.nodes.update({_id:id}, {$set:values});
}
// Note that 
exports.createNode = function(id, nodeLevel) {
  db.nodes.save({_id:id, nodeLevel: nodeLevel, _children:[]});
}

/*
function _packNode(id, callback) {
  var boundPackNode = function(idNodeTree) {
    //
  }
}
*/

/**
 *Packs a node into an array by flattening its tree structure
 */
exports.packNode = function(id, callback) {
  //db.nodes.
}

exports.createData = function() {
  exports.createNode('1a', 12);
  exports.createNode('1b', 12);
  exports.createNode('1c', 12);
  exports.createNode('2a', 9);
  exports.createNode('2b', 9);
  exports.createNode('2c', 9);
  exports.createNode('2d', 9);
  exports.createNode('2e', 9);
  exports.createNode('2f', 9);
  exports.createNode('3a', 6);
  exports.createNode('3b', 6);
  exports.createNode('3c', 6);
  exports.createNode('3d', 6);
  exports.createNode('3e', 6);
  exports.createNode('3f', 6);
  exports.createNode('3g', 6);
  exports.createNode('3h', 6);
  exports.createNode('4a', 3);
  exports.createNode('5a', 0);
}

exports.testTree = function() {
  exports.setChildren('1a', ['2a', '3a', '3b', '2b', '2c', '3c', '4a', '5a', '2d']);
}
