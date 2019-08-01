const validator = require('validator');

exports.postRegisterUser = (req, res, next) => {
    let { email, password, gender, birthdate } = req.body;
    email = validator.trim(email);
    if (!email || !password || !gender || !birthdate) {
        return res.status(400).send('send all required data');
    }
    if (!validator.isEmail(email)) {
        return res.status(400).send('wrong email');
    }
    if (!validator.matches(req.body.password, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,}$/)) {
        return res.status(400).send('wrong password');
    }
    if (!(gender.toLowerCase() === 'male' || gender.toLowerCase() === 'female')) {
        return res.status(400).send('wrong gender');
    }
    if (!Date.parse(birthdate)) {
        return res.status(400).send('wrong date');
    }
    res.status(200).send('git');
};