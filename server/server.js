const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');
const folderRoutes=require('./routes/folder');
const shareRoutes=require('./routes/shareRoutes');
const searchRoutes = require("./routes/searchRoute");
const dashBoardRoutes = require("./routes/dashBoardRouter");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();
// CORS first
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));



app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/share', shareRoutes);
app.use("/api/search", searchRoutes);
app.use('/api/dashboard', dashBoardRoutes);
const cron = require("node-cron");
const cleanTrash = require("./utils/trashCleaner");





cron.schedule("0 0 * * *", () => {

    console.log("Trash cleaner running");

    cleanTrash();

});


mongoose.connect(process.env.MONGODB_URI, {
})
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});




