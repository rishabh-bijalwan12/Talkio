const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');


require('dotenv').config()
const User = require('../models/user.model')


//register user
exports.Register = async (req, res) => {
    const { name, username, password } = req.body

    try {
        if (!name || !username || !password) {
            res.status(400).json({ message: "All fields are required" })
        }

        const response = await User.findOne({ username })

        if (response) {
            res.status(400).json({ message: "User already existed" })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = User.create({
            name,
            username,
            password: hashPassword
        })

        res.status(201).json({ message: "Registered successfully!" });
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json({ message: "Internal Server Error" })
    }

}

//login route
exports.Login = async (req, res) => {
    const jwtSecret = process.env.JWT_SECRET;
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ username }).select('_id name username password');
        const id = user._id.toString();
        
        if (!user) {
            return res.status(401).json({ message: "Wrong username or password" });
        }

        const isCorrect = await bcrypt.compare(password, user.password);

        if (!isCorrect) {
            return res.status(401).json({ message: "Wrong username or password" });
        }

        const token = jwt.sign({ _id: user._id }, jwtSecret);

        return res.status(200).json({ message: "Login successful", token,username,id});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//get all users
exports.GetAllUser = async (req, res) => {
    try {
        const users = await User.find().select('_id username name');
        if (!users) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json({ users });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.GetUser = async (req,res) => {
    const id = req.param.id
    try{
        const user = await User.findOne({id});
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        res.status(200).json({ user });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
