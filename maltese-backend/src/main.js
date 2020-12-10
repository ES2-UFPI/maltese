const express = require("express");
const mongoose = require("mongoose");

const uri = "mongodb+srv://maltese:ufpi@maltese.hwddu.mongodb.net/testes?retryWrites=true&w=majority"
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const app = express();

app.use(express.json());

app.listen(3333, () => console.log("Servidor executando na porta 3333..."));