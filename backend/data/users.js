import bcrypt from 'bcryptjs';

const users = [
	{
		name: 'Admin',
		email: 'admin@gmail.com',
		password: bcrypt.hashSync('123456', 10),
		isAdmin: true,
	},
	{
		name: 'Jacob',
		email: 'jacob@gmail.com',
		password: bcrypt.hashSync('123456', 10),
	},
	{
		name: 'Yanlin',
		email: 'yanlin@gmail.com',
		password: bcrypt.hashSync('123456', 10),
	},
];

export default users;
