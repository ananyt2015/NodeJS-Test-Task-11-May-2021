var express = require('express');
var router = express.Router();
const articleController = require('./controller/articleController');
const commentController = require('./controller/commentController');


const testWare = (req, res, next) => {
    next();
} 
router.get('/article/:id' , testWare , articleController.getArticleById);
router.post('/article' , testWare , articleController.create);
router.get('/article' , testWare , articleController.getArticleAll);
router.put('/article/:id' , testWare , articleController.update);
router.delete('/article/:id' , testWare , articleController.deleteArticleById);

router.post('/comment' , testWare , commentController.create);
router.get('/comment/:article_id' , testWare , commentController.getCommentByArticleId);

module.exports = router ;