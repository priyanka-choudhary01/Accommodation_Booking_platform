const mongoose = require("mongoose");
const Listing  = require("../models/listing.js");
const initData = require("../init/data.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/Wonderlust"

main().then(() => console.log("connection sucessful"))
.catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDb = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({
        ...obj, location: obj.location.toUpperCase(), owner : "68ab1849b0fe0c4289f69a36",geometry: {
    type: "Point",
    coordinates: [77.5946, 12.9716], 
        },
    }));

//   initData.data = initData.data.map(obj =>({...obj,  location: obj.location.toUpperCase()}));
    await Listing.insertMany(initData.data);
    console.log("data was initializeed");
};
initDb();