const express = require("express")

const router = express.Router();
const gravatar = require("gravatar")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
const { check, validationResult } = require("express-validator")

const User = require("../../models/User")

router.post("/", [
        check("name", "Name is required")
        .not()
        .isEmpty(),
        check("email", "please include a valid email").isEmail(),
        check("Phonenumber", "please enter a phone number").isLength({ max: 10 }),
        check("Username", "please enter a user name").not().isEmpty(),
        check(
            "password",

            "please enter a password with 6 or more characters"
        ).isLength({ min: 6, max: 12 }),
        check("passwordconfirm", "please enter a confirm password"),

        check("password").custom((password, { req }) => {
            if (password !== req.body.confirmpassword) {
                throw new Error("password confirmation is incorrect")
            }
            return true
        }),
        check("phonenumber").custom((phonenumber, { req }) => {
            if (phonenumber !== req.body.confirmphonenumber) {
                throw new Error("phonenumber confirmation is incorrect")
            }
            return true
        }),
        // email checking
        check("email").custom(async(email) => {
            const user = await User.findOne({ email })
            if (user) {
                throw new Error("email is already exist")
            }
            return true
        })
    ],
    async(req, res) => {
        // console.log(req.body)

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
            return;
        }

        const { name, email, Phonenumber, Username, password, confirmpassword, confirmphonenumber } = req.body;
        try {

            const avatar = gravatar.url(email, {
                s: "200",
                r: "pg",
                d: "mm"
            })

            const user = new User({
                name,
                email,
                Phonenumber,
                Username,
                password,
                avatar,
                confirmpassword,
                confirmphonenumber

            })


            const salt = await bcrypt.genSalt(10); // 10 how much we will give that much it is protected

            user.password = await bcrypt.hash(password, salt)

            await user.save();
            // return json webtoken
            // res.send("successfully completed");

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get("jwtSecret"), { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                })

        } catch (err) {
            console.error(err.message);
            res.status(500).send("server error");


        }
    });
module.exports = router;