import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
			default: '/images/default-avatar.jpg',
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

// authenticate user password
userSchema.methods.matchPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

// before save user info
userSchema.pre('save', async function (next) {
	// only hash password if password is modified
	if (!this.isModified('password')) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
