import mongoose from "mongoose";


const testSchema = mongoose.Schema({
    name: String,
    email: String,
});

const test =  mongoose.models.Test || mongoose.model("Test", testSchema);
export default test;