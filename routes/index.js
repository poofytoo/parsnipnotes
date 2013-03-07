
/*
* GET home page.
*/

exports.index = function(req, res){
  res.render('main', { title: 'Express', userName: req.user, packName: req.params.packName, bookName: req.params.bookName, displayMode: 'nb' });
};

exports.graph = function(req, res){
  res.render('main', { title: 'Express', userName: req.user, packName: req.params.packName, bookName: req.params.bookName, displayMode: 'graph' });
};
