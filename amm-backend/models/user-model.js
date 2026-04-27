// Import Required Modules
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Import User Schema
import userSchema from '../schema/schema-user.js';

// Password Hashing Middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Password Comparison Method
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Create and Export User Model
const UserModel = mongoose.model('AMM-User', userSchema);

export default UserModel;
