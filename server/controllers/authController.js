const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
}



// REGISTER

exports.registerUser = async (req, res) => {


    try {


        const { name, email, password } = req.body;



        const isExists = await User.findOne({ email });


        if (isExists) {

            return res.status(400).json({

                message: "User already exists"

            });

        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );



        const newUser = new User({

            name,

            email,

            password: hashedPassword

        });



        await newUser.save();



        return res.status(201).json({

            message: "User registered successfully",
            token: generateToken(newUser),
            _id:newUser._id,
            name:newUser.name,
            email:newUser.email

        });


    }

    catch (error) {


        console.log(error);


        return res.status(500).json({

            message: "Server error"

        });


    }


};




// LOGIN


exports.loginUser = async (req, res) => {


    try {


        const { email, password } = req.body;



        const user = await User.findOne({ email });



        if (!user) {

            return res.status(400).json({

                message: "Invalid credentials"

            });

        }



        const isMatch = await bcrypt.compare(
            password,
            user.password
        );



        if (!isMatch) {

            return res.status(400).json({

                message: "Invalid credentials"

            });

        }



        return res.status(200).json({

    message: "Login successful",

    _id: user._id,

    token: generateToken(user),

    name: user.name,

    email: user.email,

    plan: user.plan,

    usedStorage: user.usedStorage,

    storageLimit: user.storageLimit

});

    }

    catch (error) {


        console.log(error);


        return res.status(500).json({

            message: "Server error"

        });

    }


};