exports.adminAuth = (req, res, next) =>{
    if (req.user.role === 'admin'){
        next();
    }
    else{
        req.status(404).send("You shall no pass");
    }
}