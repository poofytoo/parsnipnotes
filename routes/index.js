
/*
* GET home page.
*/

exports.index = function(req, res){
  res.render('main', { title: 'Express', packName: req.params.packName, userName: req.params.userName, displayMode: 'nb' });
};

exports.graph = function(req, res){
  res.render('main', { title: 'Express', packName: req.params.packName, userName: req.params.userName, displayMode: 'graph' });
};
