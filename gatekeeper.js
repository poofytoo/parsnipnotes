/*
 *JSON Schema
 *node:
 *{
 *  _id: "/owner/folder/file"
 *  
 *  // Data Entries
 *  children: [ tree structure ]
 *  title: "myTitle"
 *  content: "this is a great content!"
 *  nodeLevel: 0 (chunk), 3 (section/chapter), 6 (unit), 9 (class/book/packet) // Not implemented
 *
 *  // Other Stuff
 *}
 *
 *tree:
 *{
 *  _id: id of child
 *  nodeLevel: same // Not implemented
 *  children: [ tree structure ]
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

/**
 *flattenNode takes a node array then returns the linearized version. Only
 *primary children are expanded and no formatting is kept.
 */
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

exports.addNode = function(id, title, content) {
  db.nodes.save({_id: id, title: title, content: content, children: []}, function(err, saved) {
    if( err || !saved ) console.log("Node not saved");
    else console.log("Node saved");
  });
}

/**
 *packNode takes a node array and flattens it into a tree recursively
 */
exports.packNode = function(nodes) {
  //
}
