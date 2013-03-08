/**
 *Search functions go here
 */

var databaseUrl = "notely";
var collections = ["nodes", "search"]
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
    db.search.find({_id: {$regex: '^' + query}}, function(err, results) {
        if (err) {
            console.log('Error in search');
        } else if (results) {
            if (results.length > limit) {
                results.length = limit;
            }
            for (var i in results) {
                var result = results[i];
                result.title = result._id + result.node_id.replace(/(.*)_(.*)_(.*)/, ' ($1 Lecture $2)');
                result.nodeLevel = 0;
                result._children = [];
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
      makeSearchQuery(id, id, callback);
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

