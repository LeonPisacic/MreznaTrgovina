import { Router } from "express";
import asyncHandler from "express-async-handler";

import { proizvodiModel } from "../models/proizvodi.model";

const router = Router();


//upisivanje proizvoda u mongoDB bazu podataka (upisati url - 'http://localhost:5000/api/proizvodi/seed')
router.get("/seed", asyncHandler(
    async (req, res) => {
        const proizvodiCount = await proizvodiModel.countDocuments();
        const PROIZVODI = await proizvodiModel.find()

        if (proizvodiCount > 0) {
            res.send("Seed is already done");
            return;
        }

        await proizvodiModel.create(PROIZVODI);

        res.send("Seed is done");
    }
));


//api koji ispisuje sve prozivode sa stranice
router.get("/", asyncHandler(
    async (req, res) => {
        const PROIZVODI = await proizvodiModel.find();
        res.send(PROIZVODI);
    }
));

//api za dodavanje novih proizvoda (postaviDodanNoviProizvod) u data.service.ts
router.post("/", asyncHandler(
    async (req, res) => {
        const proizvod = req.body;
        proizvod.kolicina = 1;
        const newProizvod = await proizvodiModel.create(proizvod);

        res.status(201).json(newProizvod);
    }
));

// API za filtriranje proizvoda prema kategoriji (u search bar se upisuje naziv kategorije (npr. 'Mobilni uređaji))
router.get("/:searchTerm", asyncHandler(
    async (req, res) => {
        const searchRegex = new RegExp(req.params.searchTerm, 'i');
        const proizvodi = await proizvodiModel.find({ imeProizvoda: { $regex: searchRegex } });

        res.send(proizvodi);
    }
));


//API za filtriranje proizvoda prema ID-u (ukoliko se id kategorije poklapa, ispisuje se objekt proizvoda sa tim ID-em)
router.get("/id/:searchTerm", asyncHandler(
    async (req, res) => {
        const searchRegex = new RegExp(req.params.searchTerm, 'i');
        const proizvodi = await proizvodiModel.find({ kategorijaID: { $regex: searchRegex } });

        res.send(proizvodi);
    }
));


//API za filtriranje proizvoda prema jedinstvnoj oznaci (sifra)
router.get("/sifra/:searchTerm", asyncHandler(
    async (req, res) => {
        const searchTerm = parseFloat(req.params.searchTerm);
        const PROIZVODI = await proizvodiModel.find();

        const idKategorije = PROIZVODI.filter((obj) => {
            if (obj.sifra === searchTerm) {
                return true;
            }
        });

        res.send(idKategorije)
    }
));

//dohvacanje nekog proizvoda na nekom index-u (koristi se za uredivanje proizvoda u admin nacinu rada) - dobro radi
router.get("/index/:searchTerm", asyncHandler(
    async (req, res) => {
        const PROIZVODI = await proizvodiModel.find();
        const searchTerm = parseInt(req.params.searchTerm);

        res.send(PROIZVODI[searchTerm]);
    }
));

router.put("/", asyncHandler(async (req, res) => {
    const updatedProducts = req.body;

    for (let i = 0; i < updatedProducts.length; i++) {
        const product = updatedProducts[i];
        const sifra = product.sifra;

        await proizvodiModel.updateOne({ sifra: sifra }, product);
    }

    const allProducts = await proizvodiModel.find();
    res.send(allProducts);
}));




// updatanje vec postojeceg proizvoda u admin načinu rada
router.put("/index/:searchTerm", asyncHandler(
    async (req, res) => {
        const searchTerm = parseInt(req.params.searchTerm);
        const productToUpdate = await proizvodiModel.findOne().skip(searchTerm);

        if (productToUpdate) {
            const updatedProduct = {
                imeProizvoda: req.body.imeProizvoda,
                kratakOpisProizvoda: req.body.kratakOpisProizvoda,
                opis: req.body.opis,
                slika: req.body.slika,
                cijena: req.body.cijena,
                respolozivo: req.body.respolozivo,
                ukupno: req.body.ukupno,
                kolicina: req.body.kolicina,
                sifra: req.body.sifra,
                kategorijaID: req.body.kategorijaID,
            };

            // Update the product in the database here.
            await proizvodiModel.updateOne({ _id: productToUpdate._id }, updatedProduct);
        }
        res.send(await proizvodiModel.find())
    }

));

//brisanje proizvoda sa odredenog indexa u admin načinu rada
router.delete("/index/:searchTerm", asyncHandler(
    async (req, res) => {
        const searchTerm = parseInt(req.params.searchTerm);
        const PROIZVODI = await proizvodiModel.find();

        if (searchTerm >= 0 && searchTerm < PROIZVODI.length) {
            const productToDelete = PROIZVODI[searchTerm];
            await proizvodiModel.deleteOne({ _id: productToDelete._id });
            res.status(204).send();
        }
    }
));


export default router;