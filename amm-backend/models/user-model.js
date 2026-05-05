// Import Required Modules
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Import User Schema
import userSchema from '../schema/schema-user.js';

// Password Hashing Middleware for .save()
userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

// Password Hashing Middleware for .findOneAndUpdate() as safety measure
userSchema.pre('findOneAndUpdate', async function() {
    if (this.getUpdate().password) {
        try {
            const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
            this.getUpdate().password = await bcrypt.hash(this.getUpdate().password, salt);
        } catch (error) {
            throw error;
        }
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
