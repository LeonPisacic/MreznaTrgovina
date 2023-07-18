import { Router } from "express";
import asyncHandler from "express-async-handler";

import { kategorijeProizvoda } from "../data";
import { kategorijaProizvodaModel } from "../models/kategorija.model";

const router = Router(); //By creating an instance of the Router, you can define routes and associated handlers specific to this router

//upis podataka u mongoDB bazu podataka (upisati url - 'http://localhost:5000/api/filtriranjeKategorija/seed')
router.get("/seed", asyncHandler(
    async (req, res) => {
        const kategorijaCount = await kategorijaProizvodaModel.countDocuments();

        if (kategorijaCount > 0) {
            res.send("Seed is already done");
            return;
        }

        await kategorijaProizvodaModel.create(kategorijeProizvoda);
        res.send("Seed is done");
    }
));


// API koji ispisuje sve kategorije proizvoda
router.get("/", (req, res) => {
    res.send(kategorijeProizvoda);
});


//API koji ispisuje kategorije proizvoda po nazivu iste 
router.get("/:searchTerm", asyncHandler(
    async (req, res) => {
        // const KATEGORIJEPROIZVODA = await kategorijaProizvodaModel.find();
        const searchTerm = req.params.searchTerm.toLowerCase(); // get search term from URL and convert to lowercase

        const kategorije = kategorijeProizvoda.filter((obj) => { // filter category objects by search term
            return obj.naziv.toLowerCase().includes(searchTerm); // return category objects whose 'naziv' property includes the search term
        });
        res.send(kategorije);
    }
));

export default router;

