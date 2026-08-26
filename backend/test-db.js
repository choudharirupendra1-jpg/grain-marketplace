const mongoose = require("mongoose");

const uri = "mongodb+srv://choudharirupendra1_db_user:Rupen1234@cluster0.jd9fzxc.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

console.log("Connecting...");

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000
})
.then(() => {
    console.log("✅ MongoDB CONNECTED");
    process.exit(0);
})
.catch((err) => {
    console.log("❌ MongoDB ERROR");
    console.log("Name:", err.name);
    console.log("Message:", err.message);
    if (err.reason) console.log("Reason:", err.reason);
    process.exit(1);
});