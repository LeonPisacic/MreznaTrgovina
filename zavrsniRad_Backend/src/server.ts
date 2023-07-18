import express from 'express'
import cors from 'cors'

import registracijaRouter from './routers/registracija.router'
import kategorijaRouter from './routers/kategorija.router'
import proizvodiRouter from './routers/proizvodi.router';
import povijestNarudzbiRouter from './routers/povijestNarudzbi.router';
import porukaKorisnikaRouter from './routers/porukaKorisnik.router'

import { dbConnect } from './configs/database.config'; // Uvoz funkcije dbConnect iz database.config datoteke

import dotenv from 'dotenv'; //dohvacanje podataka iz .env file-a
import porukaAdministratorRouter from './routers/porukaAdministrator.router';

dotenv.config(); // Konfiguracija dotenv modula

dbConnect(); // Povezivanje na bazu podataka

process.env.MONGO_URI; // Pristupanje URI-u MongoDB baze podataka koji je definiran u .env datoteci

const app = express(); // Stvaranje instance aplikacije pomoću Express modula
const bodyParser = require('body-parser'); // Uvoz body-parser modula
const nodemailer = require("nodemailer");


app.use(bodyParser.json()); // Upotreba body-parsera za parsiranje ulaznih podataka u JSON formatu
app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200'],
})
); // Upotreba Cors modula za omogućavanje Cross-Origin Resource Sharing (CORS) između poslužitelja i klijenta koji se nalazi na http://localhost:4200


/*kada request dođe do url-a (etc. '/api/registracija'), odgovarajuca rukovoditeljska ruta definiranna unutar 
(etc. 'registracijaRouter') biti će izvršena da se nose sa tim zahtjevom */
app.use('/api/registracija', registracijaRouter);
app.use('/api/filtriranjeKategorija', kategorijaRouter);
app.use('/api/proizvodi', proizvodiRouter);
app.use('/api/povijestNarudzbi', povijestNarudzbiRouter);
app.use('/api/porukaKorisnika', porukaKorisnikaRouter);
app.use('/api/porukaAdministratora', porukaAdministratorRouter);
const port = 5000; // Definicija porta na kojem će se aplikacija slušati
app.listen(port, () => {
    console.log('Website served in http://localhost:' + port);
}); // Pokretanje servera na određenom portu i ispisivanje poruke "Website served in http://localhost:<port>" kada server bude pokrenut