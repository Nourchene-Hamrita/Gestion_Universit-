const express =require('express');
const bodyParser =require('body-parser');
const mongoose =require('mongoose');
const cors =require('cors');
const dotenv =require('dotenv');
const Router =require('./route/router');
const {router:AuthRouter} =require('./route/auth');


const app = express();
dotenv.config();
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use('', Router);
app.use('/auth', AuthRouter);


const CONNECTION_URL =  process.env.CONNECTION_URL;
const PORT = process.env.PORT|| 5000;
mongoose.set('strictQuery', true);
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server is running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));