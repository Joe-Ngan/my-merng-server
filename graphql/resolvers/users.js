const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');
const { UserInputError } = require('apollo-server');

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: 3600 });
}
module.exports = {
    Mutation: {
        // parent , args, context, info
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);

            if(!valid){
                throw new UserInputError('Errors', { errors });
            }
            const user = await User.findOne({ username });
            if (!user) {
                errors.general = 'Please Check User and Password (user)';
                throw new UserInputError('Please Check User and Password (user)', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Please Check User and Password (psw)';
                throw new UserInputError('Please Check User and Password (psw)', { errors });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            };
        },
        async register(_, { registerInput: { username, email, password, confirmPassword } }) {
            //1. validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }
            //2. make sure user not already exist
            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError('The user is already existed', {
                    errors: {
                        username: 'This username is taken'
                    }
                });
            }
            // TODO: hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            };

        }
    }
}