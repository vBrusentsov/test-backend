const Router = require('express');
const router = new Router();
const controllers = require('../controllers/authController');
const {check} = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');


router.post('/registration',[
    check('username', 'Username cannot be empty').notEmpty(),
    check('password', 'The password must be between 4 and 10 characters').isLength({min: 4, max: 10 })
], controllers.registration);
router.post('/login', controllers.login);
router.get('/users', /*authMiddleware*/ roleMiddleware(['ADMIN']), controllers.getUsers);

module.exports = router
