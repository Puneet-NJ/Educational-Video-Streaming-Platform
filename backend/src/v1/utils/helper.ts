import fs from "fs";
import { s3Init } from "./lib.js";

export const uploadToS3 = async (
	imagePath: string,
	imageName: string,
	pdfName: string
) => {
	const fileContent = fs.readFileSync(imagePath + "/" + imageName);

	const s3 = s3Init();

	let response;
	try {
		response = await new Promise((resolve, reject) => {
			s3.upload(
				{
					Bucket: "puneet-unacademy",
					Key: pdfName + imageName,
					Body: fileContent,
					ContentType: "image/png",
				},
				(err, data) => {
					if (err) {
						console.error("Error uploading file:", err);

						reject("error");
					} else {
						console.log(`File uploaded successfully. ${data.Location}`);

						resolve("success");
					}
				}
			);
		});
	} catch (err) {
		console.log(err);
		return "error";
	}

	return "success";
};
