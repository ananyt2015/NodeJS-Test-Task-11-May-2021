const modelController = require('./modelController')
const commonHelper = require('./commonHelper');


var articleController = {
    create : async function(req, res){
        try {
            let validateObj = commonHelper.validateArray(req.body , ['nickname' , 'title' , 'content']);            
            
            if(!validateObj.status){
                return commonHelper.sendResponseData(req , res , {} , validateObj.message , true , 500);
            }

            let insertObj = {
                title : req.body.title,
                nickname : req.body.nickname,
                content : req.body.content 
            }        
            let insertId = await modelController.insertIntoDb('article',insertObj);
            if(insertId){
                return commonHelper.sendResponseData(req , res , {id : insertId} , "article added" , true , 200);                        
            }
            return commonHelper.sendResponseData(req , res , {} , "Something wrongq" , true);
        }catch(error){
            console.log(error);
            return commonHelper.sendResponseData(req , res , {} , "Error at backend" , true , 500)
        }
    },
    getArticleById : async function(req, res){
        try {
            let validateObj = commonHelper.validateArray(req.params , ['id']);            
            
            if(!validateObj.status){
                return commonHelper.sendResponseData(req , res , {} , validateObj.message , true , 500);
            }
            let condition = {
                id : parseInt(req.params.id)
            }
            let articles = await modelController.findInDb(condition, 'article',['*']);
            if(articles){
                return commonHelper.sendResponseData(req , res , articles , "article found" , true , 200);                        
            }
            return commonHelper.sendResponseData(req , res , {} , "Something wrongq" , true);
        }catch(error){
            console.log(error);
            return commonHelper.sendResponseData(req , res , {} , "Error at backend" , true , 500)
        }
    },
    getArticleAll : async function(req, res){
            try{
            let currentPage = 1;
            let limit = req.query.limit ? req.query.limit : 20;
            if(req.query.page) {
                currentPage = parseInt(req.query.page);
            }    
            
                const data = {
                    articles : await modelController.fetchFromDbInRange('article' , ['*'] , limit  , currentPage-1),
                    pagination : await commonHelper.getPaginationObject('article' , limit ,currentPage)
                }
                return commonHelper.sendResponseData(req , res , data , "fetched successfully" ,false,200);
            } catch(error){
                console.log(error);
                return commonHelper.sendResponseData(req , res , {} , "Error at backend" , true)
        }

    },
    update : async function(req, res){
        try {
            let condition = {
                id : parseInt(req.params.id)
            }
            let articles = await modelController.findInDb(condition, 'article',['*']);
            if(!articles.length){
                return commonHelper.sendResponseData(req , res , {} , "not found" , true , 400);                        
            }

            let updateObj = req.body;
            updateObj = await modelController.updateTable(updateObj,  'article',req.params.id);
            if(updateObj){
                return commonHelper.sendResponseData(req , res , {} , "Successfully updated" , true , 200);                        
            } else{
                return commonHelper.sendResponseData(req , res , {} , "Something went wrong" , true , 500)
            }
        }catch(error){
            console.log(error);
            return commonHelper.sendResponseData(req , res , {} , "Error at backend" , true , 500)
        }
    },
    deleteArticleById : async function(req, res){
        try {
            let validateObj = commonHelper.validateArray(req.params , ['id']);            
            
            if(!validateObj.status){
                return commonHelper.sendResponseData(req , res , {} , validateObj.message , true , 500);
            }
            let condition = {
                id : parseInt(req.params.id)
            }
            let articles = await modelController.deleteRows(condition, 'article');
            if(articles){
                return commonHelper.sendResponseData(req , res , articles , "article Deleted" , true , 200);                        
            }
            return commonHelper.sendResponseData(req , res , {} , "Something wrongq" , true);
        }catch(error){
            console.log(error);
            return commonHelper.sendResponseData(req , res , {} , "Error at backend" , true , 500)
        }
    },
    
}

module.exports = articleController;