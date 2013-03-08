/**
 *Search functions go here
 */

var databaseUrl = "notely";
var collections = ["nodes", "search"]
var db = require("mongojs").connect(databaseUrl, collections);

exports.makeSearch = function(query, callback) {
    query = query.toLowerCase().replace(/[^\w]/g, "");
    db.search.find({_id: {$regex: '^' + query}}, function(err, results) {
        if (err) {
            console.log('Error in search');
        } else if (results) {
            for (var i in results) {
                result = results[i];
                result.title = result._id;
                result.nodeLevel = 0;
                result.children = [];
            }
            callback(results);
        }
        else {
            callback([]);
        }
    });
}
