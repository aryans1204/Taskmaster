const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
    },
    email: {
        type : String,
        unique: true,
        required : true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("String must be a valid email!")
            }
        }
    },
    password: {
        type : String,
        required : true
    },
    age: {
        type : Number,
        required : false,
        default : 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number!")
            }
        }
    },
    tokens: [{
        token: {
            type : String,
            required : true
        }
    }]
}, {
    timestamps: true
})
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = async function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()

}
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email })
    if (!user) throw new Error("No such user")
    const pass = await bcrypt.compare(password, user.password)
    if (!pass) throw new Error("Unable to login")
    return user
}
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})
const User = mongoose.model('User', userSchema)
module.exports = User