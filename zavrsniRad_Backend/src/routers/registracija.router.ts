import { Router } from "express";
import asyncHandler from "express-async-handler";
import { registracijaModel } from "../models/registracija.model";

const router = Router();
let nodemailer = require('nodemailer');

//upisivanje proizvoda u mongoDB bazu podataka (upisati url - 'http://localhost:5000/api/registracija/seed')
router.get("/seed", asyncHandler(
    async (req, res) => {
        const registracijaCount = await registracijaModel.countDocuments();
        const KORISNICI = await registracijaModel.find();

        if (registracijaCount > 0) {
            res.send("Seed is already done");
            return;
        }

        await registracijaModel.create(KORISNICI);
        res.send("Seed is done");
    }
));



// API za registraciju, ispisuje objekte svih registriranih korisnik
router.get('/', asyncHandler(
    async (req, res) => {
        const KORISNICI = await registracijaModel.find();
        res.send(KORISNICI);
    }
));


//API za dodavanje novog korisnika u polje svih korisnika
router.post('/', asyncHandler(
    async (req, res) => {
        const korisnik = req.body;
        const newKorisnik = await registracijaModel.create(korisnik); //dodavanje novog korisnika u bazu podataka
        res.status(201).json(newKorisnik);

        if (korisnik.roll !== 'gost') {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'leon.pisacic2002@gmail.com',
                    pass: 'hflstodemedoovmw'
                }
            });

            var mailOptions = {
                from: 'leon.pisacic2002@gmail.com',
                to: `${newKorisnik.email}`,
                subject: 'Potvrda registracije',
                html: `
        <p>Dragi ${newKorisnik.ime} ${newKorisnik.prezime},</p>
        <p>Uspješno ste registrirali svoj korisnički račun u našoj mrežnoj trgovini.</p>
        <p>Veselimo se svim vašim budućim narudžbama.</p>
        <br/>
        </br>
        <p >Srdačan pozdrav,</p>
        <p>Leon Pisačić, vlasnik mrežne trgovine LP</p>`,
            };


            transporter.sendMail(mailOptions, (error: any, info: { response: string }) => {
                if (error) {
                    console.log(error);
                    // Handle the error and send an error response to the client
                    res.status(500).send('Failed to send email');
                } else {
                    console.log('Email sent: ' + info.response);
                    // Send a success response to the client
                    // res.send('Email sent successfully'); // Remove this line if you don't need the email success response
                }
            });
        }

    }
));


//API za registrirane korisnike, ali ih filtrira po roll-i (admin ili korisnik)
router.get("/:searchTerm", asyncHandler(
    async (req, res) => {
        const searchTerm = req.params.searchTerm.toLowerCase();
        const KORISNICI = await registracijaModel.find();

        const filtracijaPoRolli = KORISNICI.filter((obj) => {
            return obj.roll.toLowerCase().includes(searchTerm);
        });

        res.send(filtracijaPoRolli);
    }
));


router.delete('/:searchTerm', asyncHandler(
    async (req, res) => {
        const searchTerm = parseInt(req.params.searchTerm);
        const korisnici = await registracijaModel.find();

        if (searchTerm >= 0 && searchTerm < korisnici.length) {
            const productToDelete = korisnici[searchTerm];
            await registracijaModel.deleteOne({ _id: productToDelete._id });
            res.status(204).send();
        }

    }
));


export default router;
