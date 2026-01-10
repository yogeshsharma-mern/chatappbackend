// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';




// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: API_SECRET
// });


// const uploadOnCloudniary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;
//     const response = cloudinary.uploader
//       .upload(localFilePath, {
//         resource_type: "auto"
//       })
//     // .then(result => console.log(result));
//     console.log("file is uploaded on cloudinary", response.url);
//     return response;
//   } catch (error) {
//     fs.unlinkSync(localFilePath);
//   }
// }

// export {uploadOnCloudniary};

// for vedio and audio upload
// cloudinary.v2.uploader
// .upload("dog.mp4", {
//   resource_type: "video", 
//   public_id: "my_dog",
//   overwrite: true, 
//   notification_url: "https://mysite.example.com/notify_endpoint"})
// .then(result=>console.log(result));
// utils/cloudinary.js
// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
console.log("p",process.env.CLOUD_NAME,process.env.API_KEY,process.env.API_SECRET);
import fs from "fs";

if (
  !process.env.CLOUD_NAME ||
  !process.env.API_KEY ||
  !process.env.API_SECRET
) {
  throw new Error("❌ Cloudinary env variables missing");
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);
    console.log(
      "response",response
    )
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw error;
  }
};
