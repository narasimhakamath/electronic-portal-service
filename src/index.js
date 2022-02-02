const express = require('express');
const mongoose = require('mongoose');

const app = express();
mongoose.connect(process.env.MONGO_URI);
app.use(express.json());

app.listen(process.env.PORT, () => console.log(`Server is running on port: ${process.env.PORT}`));