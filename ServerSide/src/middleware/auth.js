const { ClientRoles } = require('../clientRole');

// Assumes we are going to call current Client before this middleware
const requireAuthorization = (roles) => {

    const checkAuthorization = (req, res, next) => {

        if (req.hostname === 'palnesto.com' && (req.method === 'GET')) {
            next();
            return;
        }
        if (!req.currentUser) {
            return res.status(400).send("You must be logged in to view this resource.");
        }

        const exists = roles.includes(req.currentUser.role);
        if (!exists) {
            return res.status(401).send("not authorized")
        }

        next();
    };
    return checkAuthorization;
};

module.exports = requireAuthorization;
