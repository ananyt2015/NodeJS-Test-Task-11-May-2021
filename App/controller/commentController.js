const modelController = require('./modelController')
const commonHelper = require('./commonHelper');


var articleController = {
    create : async function(req, res){
        try {
            let validateObj = commonHelper.validateArray(req.body , ['nickname' , 'comment' , 'article_id']);            
            
            if(!validateObj.status){
                return commonHelper.sendResponseData(req , res , {} , validateObj.message , true , 500);
            }
            let result = await modelController.findInDb({id : parseInt(req.body.article_id)} , 'article' , ['id'])
            console.log(result)
            if(!result.length){
                return commonHelper.sendResponseData(req , res , {} , "Article not found" , true , 500)
            }
            let insertObj = {
                nickname : req.body.nickname,
                article_id : req.body.article_id,
                comment : req.body.comment ,
                reply_of : 0
            }
            
            if(req.body.reply_of){

                result = await modelController.findInDb({id : parseInt(req.body.reply_of)} , 'comments' , ['id'])
                console.log(result)
                if(!result.length){
                    return commonHelper.sendResponseData(req , res , {} , "reply_of not found" , true , 500)
                }
                insertObj.reply_of = req.body.reply_of;
            }   
            let insertId = await modelController.insertIntoDb('comments',insertObj);
            if(insertId){
                return commonHelper.sendResponseData(req , res , {id : insertId} , "comments added" , true , 200);                        
            }
            return commonHelper.sendResponseData(req , res , {} , "Something wrongq" , true);
        }catch(error){
            console.log(error);
            return commonHelper.sendResponseData(req , res , {} , "Error at backend" , true , 500)
        }
    },
    getCommentByArticleId : async function(req, res){
        try {
            let validateObj = commonHelper.validateArray(req.params , ['article_id']);            
            
            if(!validateObj.status){
                return commonHelper.sendResponseData(req , res , {} , validateObj.message , true , 500);
            }
            let condition = {
                article_id : parseInt(req.params.article_id)
            }
            let comments = await modelController.findInDb(condition, 'comments',['*']);
            for(var i in comments){
                console.log(comments[i] , "inside")
                let reply = [];
                if(comments[i].reply_of == 0){
                    
                    comments.forEach((item , index) => {
                        console.log(item.reply_of , comments[i].id)
                        if(item.reply_of == comments[i].id){
                            console.log("index" , item)
                            reply.push(item);
                            comments.splice(index, 1);
                        }
                    })
                }    
                comments[i].reply = reply;
            }
            return commonHelper.sendResponseData(req , res , comments , "Comments found" , true, 200);

        }catch(error){
            console.log(error);
            return commonHelper.sendResponseData(req , res , {} , "Error at backend" , true , 500)
        }
    }
    
}

module.exports = articleController;