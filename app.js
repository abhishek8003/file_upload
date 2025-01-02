require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path")
app.set("view engine", "ejs");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, path.join(__dirname, "uploads"))
    },
    filename: function (req, file, cb) {
        let filename = `${Date.now()}-${file.originalname}`
        return cb(null, filename)
    }
})
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
})
const upload = multer({
    storage: diskStorage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.includes("image")) {
            return cb(null, true)
        }
        return cb("File must be image")
    },
    limits: { fileSize: 1024 * 1024 * 20 }
})
app.get("/", (req, res) => {
    res.render("home.ejs");
});
app.post("/save", upload.single("file1"), async (req, res) => {
    try {
        console.log(req.file);
        
        let respose=await cloudinary.uploader.upload(req.file.path,{
            allowed_formats:["jpeg","png"],
            fileSize:1024,
            resource_type:"auto",
            folder:"myfolder_testing"
        });
        console.log(respose);
        res.send("file uploaded to local and cloud!")
        
    } catch (error) {
        console.log(error);

    }
})
app.listen("5000", () => {
    console.log("Server is listeing to 5000..");

})