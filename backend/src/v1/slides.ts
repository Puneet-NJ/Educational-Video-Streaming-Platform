import express from "express";
import auth from "./middleware/auth.js";
import multer from "multer";
import { client, maxPdfSize } from "./utils/lib.js";
import { slidesValidation } from "./types/zod.js";
import { exec } from "child_process";
import fs from "fs";
import { uploadToS3 } from "./utils/helper.js";

const upload = multer({
	dest: "uploads/pdf/",
	limits: { fileSize: maxPdfSize },
});

const slidesRouter = express.Router();

slidesRouter.post(
	"/:roomId",
	upload.single("slides"),
	auth(["Admin", "Teacher"]),

	async (req, res) => {
		try {
			const validateInput = slidesValidation.safeParse(req.file);
			if (!validateInput.success) {
				res.status(411).json({ msg: "Invalid slide size or type" });
				return;
			}

			const userId = res.locals.id;
			const roomId = req.params.roomId;
			const pdfName = req.file?.filename as string;
			const pdfPath = req.file?.path as string;

			const imagePath = `uploads/images/${pdfName}`;

			const room = await client.room.findFirst({
				where: {
					id: roomId,
				},
				select: {
					teacherId: true,
				},
			});

			if (!room) {
				res.status(403).json({ msg: "Invalid roomId" });
				return;
			}
			if (room.teacherId !== userId) {
				res
					.status(403)
					.json({ msg: "You are not the teacher of the space/room" });
				return;
			}

			fs.mkdirSync(imagePath);

			let imageDir: string[];
			try {
				imageDir = await new Promise((resolve, reject) => {
					exec(
						`magick -verbose -density 150 ${pdfPath} -resize 1024x -background white -alpha remove +adjoin ${imagePath}/-.jpg`,
						(err) => {
							if (err) {
								reject("error");
							}

							const imageDir = fs.readdirSync(imagePath);
							resolve(imageDir);
						}
					);
				});
			} catch (err) {
				console.log(err);
				res.status(500).json({ msg: "Error while converting pdf to images" });
				return;
			}

			try {
				const uploadResponse = await new Promise(async (resolve, reject) => {
					const uploadPromises = imageDir.map(async (image: string) => {
						await uploadToS3(imagePath, image, pdfName);
					});

					try {
						await Promise.all(uploadPromises);

						resolve("success");
					} catch (err) {
						console.log("Promise rejected", err);

						reject("error");
					}
				});
			} catch (err) {
				res.status(500).json({ msg: "Error while putting in s3" });
				return;
			}

			const createSlideImages = imageDir.map((image) => ({
				roomId,
				imageKey: pdfName + image,
			}));

			const slideImagesRes = await client.slidesImage.createManyAndReturn({
				data: createSlideImages,
			});

			const slideImages = slideImagesRes.map((image) => image.imageKey);

			const slides = slideImages.sort();

			fs.rm(pdfPath, { recursive: true }, (err) => {
				if (err) {
					console.log(err);
					return;
				}
			});
			fs.rm(imagePath, { recursive: true }, (err) => {
				if (err) {
					console.log(err);
					return;
				}
			});

			res.json({ msg: "Created slides", slides });
		} catch (err) {
			console.log(err);
			res.status(500).json({ msg: "Internal server error" });
		}
	}
);

export { slidesRouter };
