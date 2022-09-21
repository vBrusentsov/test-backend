const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { secret } = require('../services/config');

const generateAccessToken = (id, role) => {
    const payload = {
        id,
        role,
    }
    return jwt.sign(payload, secret, {expiresIn: '24h'});
}

class authControllers {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({massage: 'Error during registration', errors});
            }
            const {username, password} = req.body
            const candidate = await User.findOne({username});
            if(candidate) {
                return res.status(400).json({massage: 'A user with that username already exist'});
            }
            const hashPassword = bcrypt.hashSync(password, 10);
            const userRole = await Role.findOne({value: 'USER'});
            const user = new User({username, password: hashPassword, roles: [userRole.value]});
            await user.save();
            return res.json({message: 'Successful registration'});
        } catch(e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({username});
            if (!user) {
                return res.status(400).json({massage: `User ${username} not found`})
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({message: 'Password is not correct'})
            }
            const token = generateAccessToken(user._id, user.roles);
            return res.json({token});

        } catch(e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users)
        } catch(e) {
            console.log(e)
            res.status(400).json({message: ' error'})
        }
    }
}

module.exports = new authControllers()
