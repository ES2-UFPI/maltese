require("dotenv").config({
    path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

class AppController {
    constructor() {
        this.express = express();

        const uri = `mongodb+srv://maltese:ufpi@maltese.hwddu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
        mongoose.connect(uri, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.express.use(express.json());
        this.express.use(
            "/files",
            express.static(path.resolve(__dirname, "..", "uploads"))
        );
    }

    routes() {
        this.express.use(require("./routes"));
    }
}

module.exports = new AppController().express;
