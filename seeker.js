/**
 *Search functions go here
 */

var databaseUrl = "notely";
var collections = ["nodes"]
var db = require("mongojs").connect(databaseUrl, collections);

function _flattenTreeToArray(node, minLevel, ret) {
  if (node.nodeLevel >= minLevel) {
    ret.push(node._id);
    if (node._children) {
      for (var i in node._children) {
        _flattenTreeToArray(node._children[i], minLevel, ret);
      }
    }
  }
  return ret;
}

/**
 * Makes basic search for given query
 */
var makeSearch = function(query, callback, limit) {
    limit = typeof limit == 'undefined' ? 5 : limit; // default limit = 5
    query = query.toLowerCase().replace(/[^\w]/g, "");
    db.nodes.find({_id: {$regex: '^_search--' + query}}, function(err, results) {
        if (err) {
            console.log('Error in search');
        } else if (results) {
            if (results.length > limit) {
                results.length = limit;
            }
            for (var i in results) {
                var result = results[i];
                result.id = result._id;
                result.title = result.title + result._children[0]._id.replace(/(.*)--(.*)--(.*)/, ' ($1 Lecture $2)');
            }
            callback(results);
        }
        else {
            callback([]);
        }
    });
}
exports.makeSearch = makeSearch;

/**
 * Searches for the given query, starting from id node (optional)
 */
var makeSearchQuery = function(id, query, callback, limit) {
    limit = typeof limit == 'undefined' ? 10 : limit; // default limit = 10
    db.nodes.findOne({_id:id}, function (err, node) {
        var lookup = [];
        if (err || !node) {
            console.log("makeSearchQuery: Can't find " + id);
        } else if (node) {
            lookup = _flattenTreeToArray(node, 0, []);
        }
        db.nodes.find({_id: {$in: lookup}}, function(err, sortedNodes) {
            console.log('found ' + sortedNodes);
            if (err) {
                console.log('Error in search');
            } else {
                var ret = [];
                for (var i in sortedNodes) {
                    if (sortedNodes[i].content.indexOf(query) != -1) {
                        sortedNodes[i].nodeLevel = 0;
                        sortedNodes[i].id = sortedNodes[i]._id;
                        ret.push(sortedNodes[i]);
                    }
                }
                // Not enough; do normal search.
                if (ret.length < limit) {
                    ret = ret.concat(makeSearch(query, callback, limit - ret.length));
                }
                return ret;
            }
        });
    });
}
exports.makeSearchQuery = makeSearchQuery;

/**
 *Packs a node into an array by flattening its tree structure
 */
exports.packNode = function(id, minLevel, callback) {
  db.nodes.findOne({_id:id}, function (err, node) {
    if (err || !node) {
      console.log("Can't find " + id);
      makeSearch(id, callback);
    } else {
      var lookup = _flattenTreeToArray(node, minLevel, []);
      
      db.nodes.find({_id:{$in: lookup}}, function (err, sortedNodes) {
        if (err || !sortedNodes) {
          console.log('Could not packNode()');
        } else {
          var ret = [];
          var nodes = {};
          
          for (var i in sortedNodes) {
            nodes[sortedNodes[i]._id] = sortedNodes[i];
            sortedNodes[i].id = sortedNodes[i]._id;
          }
          
          for (var i in lookup) {
            delete nodes[lookup[i]]._children;
            ret.push(nodes[lookup[i]]);
          }
          
          callback(ret);
        }
      });
    }
  });
}

/**
 * Adds a note.
 * The note must have the following attributes: title, content.
 */
exports.newNote = function(username, note) {
    // Add note
    db.nodes.insert({'title': note.title, 'content': note.content, 'children': [], 'nodeLevel': 0}, {safe: true}, function(err, records) {
        if (err) {
            console.log("newNote: error in inserting new note");
        } else {
            // Add to user list (must be in callback because it needs id)
            records[0].content = ''
            db.nodes.update({'_id': username + ":"}, { $push: {'children': records[0]} });
        }
    });
}
