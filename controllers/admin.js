const User = require('../models/user');
exports.putUserUpdate = (req, res, next) => { 
        User.findByIdAndUpdate(req.body.userId, res.body, (err, result)=>{
            if(err){
                console.log(err);
                res.status(404).send("No user");
            }
            res.status(200).send("Updated successfull");
        });
}

exports.deleteUserProfile = (req, res, next) => { 
    User.findByIdAndDelete(req.body.userId, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).send("Something went wrong");
        }
        res.status(200).send("Account deleted");
    })
}