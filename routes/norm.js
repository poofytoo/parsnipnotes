
exports.pages = function(req, res){
  res.render('norm/' + req.params.page);
}
