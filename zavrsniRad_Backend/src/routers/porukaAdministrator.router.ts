import { Router } from "express";
import asyncHandler from "express-async-handler";
import { porukaAdministratorModel } from "../models/porukaAdministrator.model";

const router = Router();
let nodemailer = require('nodemailer');


router.get("/seed", asyncHandler(
    async (req, res) => {
        const porukeCount = await porukaAdministratorModel.countDocuments();
        const porukeAdministratora = await porukaAdministratorModel.find()

        if (porukeCount > 0) {
            res.send("Seed is already done");

        }

        await porukaAdministratorModel.create(porukeAdministratora);
        res.send("Seed is done");
    }
));


router.get('/', asyncHandler(
    async (req, res) => {
        const porukeAdministratora = await porukaAdministratorModel.find();

        res.send(porukeAdministratora);
    }
));

router.post('/', asyncHandler(async (req, res) => {
    const porukeAdministratora = req.body;

    const novaPorukaAdministratora = await porukaAdministratorModel.create(porukeAdministratora);

    // Respond with the created message
    res.send(novaPorukaAdministratora);

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'leon.pisacic2002@gmail.com',
            pass: 'hflstodemedoovmw'
        }
    });

    if (porukeAdministratora.porukaKorisnika === "") {
        var mailOptions = {
            from: 'leon.pisacic2002@gmail.com',
            to: `${novaPorukaAdministratora.email}`,
            subject: 'Javljanje admina mrežne trgovine LP',
            text: `Dragi ${novaPorukaAdministratora.ime}, \n \nAdmin naše mrežne trgovine ima sljedeću poruku za tebe: \n \n${novaPorukaAdministratora.porukaZaKorisnika}\n \n \n \nSrdačan pozdrav \nLeon Pisačić, vlasnik mrežne trgovine LP`
        };

        transporter.sendMail(mailOptions, (error: any, info: { response: string }) => {
            if (error) {
                console.log(error);
                // Handle the error and send an error response to the client
                res.status(500).send('Failed to send email');
            } else {
                console.log('Email sent: ' + info.response);
                // Send a success response to the client
                res.send('Email sent successfully');
            }
        });
    }

    else {
        var mailOptions = {
            from: 'leon.pisacic2002@gmail.com',
            to: `${novaPorukaAdministratora.email}`,
            subject: 'Odgovor na vaš upit',
            text: `Dragi ${novaPorukaAdministratora.ime},\n \nPovratno vam se javljamo u vezi vašeg upita : ${novaPorukaAdministratora.porukaKorisnika} \n \nOdgovor administratora mrežne trgovine :\n \n${novaPorukaAdministratora.porukaZaKorisnika}\n \n \nSrdačan pozdrav, \nLeon Pisačić, vlasnik mrežne trgovine LP`
        };

        transporter.sendMail(mailOptions, (error: any, info: { response: string }) => {
            if (error) {
                console.log(error);
                // Handle the error and send an error response to the client
                res.status(500).send('Failed to send email');
            } else {
                console.log('Email sent: ' + info.response);
                // Send a success response to the client
                res.send('Email sent successfully');
            }
        });
    }
}));


router.get("/index/:searchTerm", asyncHandler(
    async (req, res) => {
        const poruke = await porukaAdministratorModel.find();
        const searchTerm = parseInt(req.params.searchTerm);

        res.send(poruke[searchTerm]);
    }
));

router.delete("/index/:searchTerm", asyncHandler(
    async (req, res) => {
        const searchTerm = parseInt(req.params.searchTerm);
        const poruke = await porukaAdministratorModel.find();

        if (searchTerm >= 0 && searchTerm < poruke.length) {
            const productToDelete = poruke[searchTerm];
            await porukaAdministratorModel.deleteOne({ _id: productToDelete._id });
            res.status(204).send();
        }
    }
));

export default router;