/*
 *JSON Schema
 *node:
 *{
 *  _id: "/owner/folder/file"
 *  
 *  // Data Entries
 *  subtrees: [ tree array ] http://gajon.org/trees-linked-lists-common-lisp/
 *  title: "myTitle"
 *  content: "this is a great content!"
 *  nodeLevel: 0 (chunk), 3 (section/chapter), 6 (unit), 9 (class/book/packet)
 *
 *  // Other Stuff
 *}
 */

var databaseUrl = "notely";
var collections = ["nodes"]
var db = require("mongojs").connect(databaseUrl, collections);

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

function _addSibling(rootArray, leaf) {
  // This loops to the last sibling
  while (rootArray[1]) rootArray = rootArray[1];
  rootArray[1] = [[leaf]];
  return rootArray;
}

exports.addLinearChild = function(root, leafArray, where) {
  // Construct the tree
  db.nodes.findOne({_id:root}, function (err, node) {
    if (err || !node) {
      console.log("Could not find: " + root);
    } else {
      // Construct the tree
      if (node.subtrees) {
        root = [[root,node.subtrees]];
      } else {
        root = [[root]];
      }
      
      var branch = root;
      // This may or may not be a goto statement.
      outer_loop: while (where) {
        var subtree = root;
        while (subtree) {
          var sibling = subtree;
          while (sibling) {
            if (where === sibling[0][0]) {
              branch = sibling;
              break outer_loop;
            }
          }
        }
        
        console.log("Could not find " + where);
        return;
      }
      
      for (var i in leafArray) {
        if (branch[0][1]) {
          branch = _addSibling(branch[0][1], leafArray[i]);
        } else {
          branch[0][1] = [[leafArray[i]]];
          branch = branch[0][1];
        }
      }
      
      db.nodes.update({_id:root[0][0]}, {$set: {subtrees: root[0][1]}});
    }
  });
}

function _linearizeNode(root, ret, callback) {
  db.nodes.findOne({_id:root}, function (err, node) {
    if (err || !node) {
      console.log("Could not find: " + root);
      callback();
    } else {
      var subtree = node.subtrees;
      ret.val += node.title + "\n" + node.content;
      
      if (subtree) {
        // Flatten the tree
        var flatten = [subtree[0][0]];
        while (subtree[0][1]) {
          subtree = subtree[0][1];
          flatten.push(subtree[0][0]);
        }
        
        db.nodes.find({_id:{$in: flatten}}, function (err, nodes) {
          if (err || !nodes) {
            console.log("no nodes found");
          } else {
            nodes.forEach(function (node) {
              ret.val += node.title + "\n" + node.content;
            });
            callback(ret.val);
          }
        });
      } else {
        callback(ret.val);
      }
    }
  });
}
/**
 *flattenNode takes a node array then returns the linearized version. Only
 *primary children are expanded and no formatting is kept.
 */
exports.linearizeNode = function(root, callback) {
  _linearizeNode(root, {val: ""}, callback);
}

exports.addNode = function(id, title, content) {
  db.nodes.save({_id: id, title: title, content: content}, function(err, saved) {
    if( err || !saved ) console.log("Node not saved");
    else console.log("Node saved");
  });
}

/**
 *packNode takes a node array 
 */
exports.packNode = function(nodes) {
  //
}