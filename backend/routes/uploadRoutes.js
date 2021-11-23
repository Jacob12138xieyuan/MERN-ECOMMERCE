import path from 'path';
import express from 'express';
import multer from 'multer';
const router = express.Router();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'backend/uploads/');
	},
	filename: function (req, file, cb) {
		cb(
			null,
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
		);
	},
});

const checkFileType = (file, cb) => {
	const fileTypes = /jpg|jpeg|png/;
	const mimeTypes = /image\/jpeg|image\/png/;
	const matchExt = fileTypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	const matchMimeType = mimeTypes.test(file.mimetype);

	if (matchExt && matchMimeType) {
		return cb(null, true);
	} else {
		cb('Images only!');
	}
};

// {
//   fieldname: 'image',
//   originalname: 'back.jpeg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg'
// }

const upload = multer({
	storage,
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	},
});

router.post('/', upload.single('image'), (req, res) => {
	res.send(`/${req.file.path}`);
});

export default router;
