const { validationResult } = require('express-validator');

const checkValidation = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return true;
    }
};

module.exports = checkValidation;