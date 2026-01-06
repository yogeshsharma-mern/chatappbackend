import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';




cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: API_SECRET
});


const uploadOnCloudniary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = cloudinary.uploader
      .upload(localFilePath, {
        resource_type: "auto"
      })
    // .then(result => console.log(result));
    console.log("file is uploaded on cloudinary", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
  }
}

export {uploadOnCloudniary};

// for vedio and audio upload
// cloudinary.v2.uploader
// .upload("dog.mp4", {
//   resource_type: "video", 
//   public_id: "my_dog",
//   overwrite: true, 
//   notification_url: "https://mysite.example.com/notify_endpoint"})
// .then(result=>console.log(result));
