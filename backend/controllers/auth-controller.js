import { User } from '../mongoose/schema/user.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
const registerUser = async (req, res) => {

    const { email, password } = req.body;

    const userAlreadyExist = await User.findOne({ email: email });
    if (userAlreadyExist) {
        return res.status(401).send({ msg: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        email,
        password: hashedPassword
    })
    await newUser.save();
    if (newUser) {
        res.status(201).send({ msg: 'User created' });
    }

}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email: email });
    if (!userExist) {
        return res.status(401).send({ msg: 'User not exists' });
    }
    const isPaswwordMatch = await bcrypt.compare(password, userExist.password)
    if (!isPaswwordMatch) {
        return res.status(401).send({ msg: 'User password not matching' });
    }

    const accessToken = jwt.sign({
        userId: userExist._id,
        email: userExist.email,
        role: userExist.role
    }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' })


    res.status(200).send({
        msg: 'successfully logged', token: accessToken, userInfo: {
            id: userExist._id,
            email: userExist.email,
            role: userExist.role
        }
    });
}

export { registerUser, loginUser } 