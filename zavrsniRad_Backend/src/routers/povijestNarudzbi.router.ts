import { Router } from "express";
import asyncHandler from "express-async-handler";
import 'jspdf-autotable';
import { povijestNarudzbiModel } from "../models/povijestNarudzbi.model";


let nodemailer = require('nodemailer');
const router = Router(); //By creating an instance of the Router, you can define routes and associated handlers specific to this router

//upis podataka u mongoDB bazu podataka (upisati url - 'http://localhost:5000/api/povijestNarudzbi/seed')
router.get("/seed", asyncHandler(
    async (req, res) => {
        const narudzbeCount = await povijestNarudzbiModel.countDocuments();
        const narudzba = await povijestNarudzbiModel.find()

        if (narudzbeCount > 0) {
            res.send("Seed is already done");
            return;
        }

        await povijestNarudzbiModel.create(narudzba);

        res.send("Seed is done");
    }
));

router.get("/", asyncHandler( // http get req zaslužan za vracanje svih narudzbi (od svih korisnika)
    async (req, res) => {
        const PROIZVODI = await povijestNarudzbiModel.find();
        res.send(PROIZVODI);
    }
));


router.post('/', asyncHandler(async (req, res) => {
    const narudzba = req.body;
    const newNarudzba = await povijestNarudzbiModel.create(narudzba);

    // Respond with the created message
    res.send(newNarudzba);

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'leon.pisacic2002@gmail.com',
            pass: 'hflstodemedoovmw'
        }
    });

    var mailOptions = {
        from: 'leon.pisacic2002@gmail.com',
        to: `${newNarudzba.korisnik.email}`,
        subject: 'Potvrda narudžbe',
        html: `
            <p>Dragi ${newNarudzba.narudzba.ime} ${newNarudzba.narudzba.prezime},</p>
            <p>Zahvaljujemo vam na narudžbi i povjerenju. Vaš paket možete očekivati na vašoj adresi u roku od 5 radnih dana.</p>
            <p >Vaša jedinstavena sifra narudžbe: ${(newNarudzba as any)._id}.</p>
            <p>U prilogu vam također prilažemo i račun.</p>
            <br/>
            </br>
            <p >Srdačan pozdrav,</p>
            <p>Leon Pisačić, vlasnik mrežne trgovine LP</p>
            <table style="border-collapse: collapse;">
                <thead>
                    <tr style="text-align: center;">
                        <th style="border: 1px solid black; padding: 5px;">Ime proizvoda</th>
                        <th style="border: 1px solid black; padding: 5px;">Cijena proizvoda</th>
                        <th style="border: 1px solid black; padding: 5px;">Količina</th>
                        <th style="border: 1px solid black; padding: 5px;">Porez (25%)</th>
                        <th style="border: 1px solid black; padding: 5px;">Ukupno</th>
                    </tr>
                </thead>
                <tbody>
                    ${newNarudzba.proizvodi
                .map(
                    proizvod => `
                                <tr style="text-align: center;">
                                    <td style="border: 1px solid black; padding: 5px;">${proizvod.kratakOpisProizvoda}</td>
                                    <td style="border: 1px solid black; padding: 5px;">${proizvod.cijena}€</td>
                                    <td style="border: 1px solid black; padding: 5px;">${proizvod.kolicina}</td>
                                    <th style="border: 1px solid black; padding: 5px;">${(proizvod.cijena * proizvod.kolicina * 0.25).toFixed(2)}€</th>
                                    <td style="border: 1px solid black; padding: 5px;">${(proizvod.cijena * proizvod.kolicina + proizvod.cijena * proizvod.kolicina * 0.25).toFixed(2)}€</td>
                                </tr>
                            `
                )
                .join('')}
                </tbody>
                <br/>
                <tfoot>
                <tr style="text-align: center;">
                  <td colspan="3" style="border: 1px solid black; padding: 5px;"><strong>Subtotal:</strong></td>
                  <td style="border: 1px solid black; padding: 5px;">${newNarudzba.subtotal.toFixed(2)}€</td>
                </tr>
                <tr style="text-align: center;">
                  <td colspan="3" style="border: 1px solid black; padding: 5px;"><strong>Tax:</strong></td>
                  <td style="border: 1px solid black; padding: 5px;">${newNarudzba.tax.toFixed(2)}€</td>
                </tr>
                <tr style="text-align: center;">
                  <td colspan="3" style="border: 1px solid black; padding: 5px;"><strong>Total:</strong></td>
                  <td style="border: 1px solid black; padding: 5px;">${newNarudzba.total.toFixed(2)}€</td>
                </tr>
              </tfoot>
            </table>
        `,
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
}));

router.get("/index/:searchTerm", asyncHandler(
    async (req, res) => {
        const narudzbe = await povijestNarudzbiModel.find();
        const searchTerm = parseInt(req.params.searchTerm);

        res.send(narudzbe[searchTerm]);
    }
));


router.delete("/index/:searchTerm", asyncHandler(
    async (req, res) => {
        const searchTerm = parseInt(req.params.searchTerm);
        const narudzbe = await povijestNarudzbiModel.find();

        if (searchTerm >= 0 && searchTerm < narudzbe.length) {
            const productToDelete = narudzbe[searchTerm];
            await povijestNarudzbiModel.deleteOne({ _id: productToDelete._id });
            res.status(204).send();
        }
    }
));


router.put("/", asyncHandler(async (req, res) => {
    const updatedOrder = req.body;

    for (let i = 0; i < updatedOrder.length; i++) {
        const product = updatedOrder[i];
        await povijestNarudzbiModel.updateOne({ _id: product._id }, product);

        if (product.narudzbaObradena) {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'leon.pisacic2002@gmail.com',
                    pass: 'hflstodemedoovmw'
                }
            });

            var mailOptions = {
                from: 'leon.pisacic2002@gmail.com',
                to: `${product.korisnik.email}`,
                subject: 'Narudžba poslana',
                html: `
        <p>Dragi ${product.narudzba.ime} ${product.narudzba.prezime},</p>
        <p>Vaša narudžba poslana je kurirskoj službi, te će na tvoju adresu stići kroz 2 radna dana :)</p>
        <p>Hvala na ukazanom povjerenju, i veselimo se vašim budućim narudžbama!</p>
        <br/>
        <p >Vaša jedinstavena sifra narudžbe: ${(product as any)._id}.</p>
        <p >U slučaju bilo kakvih poteškoća, slobodni ste nam javiti nam se.</p>
        <br/>
        <br/>
        <br/>
        <p >Srdačan pozdrav,</p>
        <p>Leon Pisačić, vlasnik mrežne trgovine LP</p>

        <table style="border-collapse: collapse;">
            <thead>
                <tr style="text-align: center;">
                    <th style="border: 1px solid black; padding: 5px;">Ime proizvoda</th>
                    <th style="border: 1px solid black; padding: 5px;">Cijena proizvoda</th>
                    <th style="border: 1px solid black; padding: 5px;">Količina</th>
                    <th style="border: 1px solid black; padding: 5px;">Porez (25%)</th>
                    <th style="border: 1px solid black; padding: 5px;">Ukupno</th>
                </tr>
            </thead>
            <tbody>
                ${product.proizvodi
                        .map(
                            (proizvod: { kratakOpisProizvoda: any; cijena: number; kolicina: number; }) => `
                        <tr style="text-align: center;">
                            <td style="border: 1px solid black; padding: 5px;">${proizvod.kratakOpisProizvoda}</td>
                            <td style="border: 1px solid black; padding: 5px;">${proizvod.cijena}€</td>
                            <td style="border: 1px solid black; padding: 5px;">${proizvod.kolicina}</td>
                            <th style="border: 1px solid black; padding: 5px;">${(proizvod.cijena * proizvod.kolicina * 0.25).toFixed(2)}€</th>
                            <td style="border: 1px solid black; padding: 5px;">${(proizvod.cijena * proizvod.kolicina + proizvod.cijena * proizvod.kolicina * 0.25).toFixed(2)}€</td>
                        </tr>
                    `
                        )
                        .join('')}
            </tbody>
            <br/>
            <tfoot>
            <tr style="text-align: center;">
              <td colspan="3" style="border: 1px solid black; padding: 5px;"><strong>Subtotal:</strong></td>
              <td style="border: 1px solid black; padding: 5px;">${product.subtotal.toFixed(2)}€</td>
            </tr>
            <tr style="text-align: center;">
              <td colspan="3" style="border: 1px solid black; padding: 5px;"><strong>Tax:</strong></td>
              <td style="border: 1px solid black; padding: 5px;">${product.tax.toFixed(2)}€</td>
            </tr>
            <tr style="text-align: center;">
              <td colspan="3" style="border: 1px solid black; padding: 5px;"><strong>Total:</strong></td>
              <td style="border: 1px solid black; padding: 5px;">${product.total.toFixed(2)}€</td>
            </tr>
          </tfoot>
        </table>
    `,
            };

            transporter.sendMail(mailOptions, (error: any, info: { response: string }) => {
                if (error) {
                    console.log(error);
                    // Handle the error and send an error response to the client
                    res.status(500).send('Failed to send email');
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    }

    // Send a success response to the client
    res.status(200).json({ message: 'PUT request processed successfully' });
}));


export default router;