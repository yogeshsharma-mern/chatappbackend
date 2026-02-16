import mongoose from "mongoose";



export const connectToMongodb = async () => {

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'chatappyoutube'
        }).then(
            console.log("connected to mongodb")
        ).catch((error) => {
            console.log("error connecting to connect to the mongodb", error.message);
        })
    } catch (error) {
        console.log('Error connecting to mongodb', error.message);
    }
}





