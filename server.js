const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); 
const dotenv = require("dotenv"); // used to use .env file

dotenv.config({ path: "./config.env" });

const app = express();
const PORT = process.env.port || 4000;

app.use(express.json());
app.use(cors());

const DB_URL = process.env.MONGODB_URI;

// Database connection options
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//connect to the database
mongoose
  .connect(DB_URL, dbOptions)
  .then(() => {
    console.log("MongoDB Atlas connected successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error.message);
  });

// Define Schema
const Productschema = new mongoose.Schema({
  name: String,
  age: Number,
});

// MODEL
const product = new mongoose.model("product", Productschema);

//        <<<<<<------- CRUD OPERATIONS ----------->>>>>

// API --> CREATE/POST USER
app.post("/api/v1/PostItem", async (req, res) => {
  console.log(req.body);
  const NewUser = await product.create(req.body);
  res.status(201).json({
    success: true,
    message: "User Created Successfully",
    New_User: NewUser,
  });
});

// API --> READ/GET ALL USER
app.get("/api/v1/GetItem", async (req, res) => {
  const AllUser = await product.find();
  res.status(200).json({
    success: true,
    message: "Retrieved All User Successfully",
    All_User: AllUser,
  });
});

// API --> UPDATE USER
app.post("/api/v1/UpdateItem/:id", async (req, res) => {
  const UserId = req.params.id;

  const FindUser = await product.findById(UserId);

  if (!FindUser) {
    return res.status(404).json({
      success: false,
      message: "Cannot find user by the given id",
    });
  }

  const UpdateUser = await product.findByIdAndUpdate(UserId, req.body, {
    new: true, // Return the updated document
    useFindAndModify: false, // Use the new MongoDB driver instead of the deprecated one
    runValidators: true, // Run validators on update
  });

  res.status(200).json({
    success: true,
    message: "Update User Successfully",
    Updated_User: UpdateUser,
    FindUser: FindUser,
  });
});

// API --> DELETE USER
app.post("/api/v1/DeleteItem/:id", async (req, res) => {
  const UserId = req.params.id;

  const FindUser = await product.findById(UserId);

  if (!FindUser) {
    return res.status(404).json({
      success: false,
      message: "Cannot find user by the given id",
    });
  }

  const DeletedUser = await FindUser.deleteOne();

  res.status(200).json({
    success: true,
    message: "Delete User Successfully",
    Deleted_User: DeletedUser,
  });
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
