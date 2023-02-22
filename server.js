const mongoose = require("mongoose");
// const DB_HOST =
//   "mongodb+srv://kovalchukanastasia:SdRIPUHpdZ3jwJqu@cluster0.thdnwxa.mongodb.net/db-contacts?retryWrites=true&w=majority";
const app = require("./app");
const { DB_HOST } = process.env;
mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

// app.listen(3000, () => {
//   console.log("Server running. Use our API on port: 3000");
// });
