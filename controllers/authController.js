const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
// Signup
const signup = async (req, res) => {
    const { name, email, password } = req.body

    let existingUser;

    try {
        existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: 'User already exist' })
        }

        // Bcrypt
        const saltRounds = 10
        const hashedPassword = bcrypt.hashSync(password, saltRounds)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        let token;
        token = jwt.sign(
            { userId: user.id, email: user.email },
            "secretkeyappearshere",
            { expiresIn: "1h" }
        );

        return res
            .status(201)
            .json({
                success: true,
                data: {
                    userId: user.id,
                    user: user,
                    token: token
                },
            });
    } catch (error) {
        return res.status(400).json({ message: 'Error in sign up' })
    }

}

// Login
const login = async (req, res, next) => {
    let { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch {
        const error = new Error("Error! Something went wrong.");
        return next(error);
    }
    if (!existingUser) {
        const error = Error("Wrong details please check at once");
        return next(error);
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password)

    if (!isPasswordCorrect) {
        const error = Error("Wrong details please check at once");
        return next(error);
    }
    let token;
    try {
        //Creating jwt token
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            "secretkeyappearshere",
            { expiresIn: "1h" }
        );
    } catch (err) {
        console.log(err);
        const error = new Error("Error! Something went wrong.");
        return next(error);
    }

    res
        .status(200)
        .json({
            success: true,
            data: {
                userId: existingUser.id,
                email: existingUser.email,
                token: token,
            },
        });
}


module.exports = { signup, login }