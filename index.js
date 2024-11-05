import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routesUsers from './routes/users.js';
import routesProducts from './routes/products.js';
import routesCategories from './routes/categories.js';

const app = express();

app.use(express.json({limit:'1mb'}));
app.use(express.urlencoded({ limit:'1mb', extended: true }));

app.use(cors());

app.use('/utfeast', routesUsers);
app.use('/utfeast', routesProducts);
app.use('/utfeast',routesCategories)

try{
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, console.log(`Servidor activo en el puerto: ${PORT}`));
}catch(e){
    console.log(e);
}