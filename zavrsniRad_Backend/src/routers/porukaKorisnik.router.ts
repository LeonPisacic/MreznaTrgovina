import { Router } from "express";
import asyncHandler from "express-async-handler";
import { porukaKorisnikaModel } from "../models/porukaKorisnik.model";

const router = Router();

router.get("/seed", asyncHandler(
    async (req, res) => {
        const porukeCount = await porukaKorisnikaModel.countDocuments();
        const porukeKorisnika = await porukaKorisnikaModel.find();

        if (porukeCount > 0) {
            res.send("Seed is already done");
        }

        await porukaKorisnikaModel.create(porukeKorisnika);
        res.send("Seed is done");
    }
));


router.get('/', asyncHandler(
    async (req, res) => {
        const porukeKorisnika = await porukaKorisnikaModel.find();

        res.send(porukeKorisnika);
    }
));

router.post('/', asyncHandler(
    async (req, res) => {
        const porukaKorisnika = req.body;

        const novaPorukaKorisnika = await porukaKorisnikaModel.create(porukaKorisnika);

        res.send(novaPorukaKorisnika);
    }
));


router.get("/index/:searchTerm", asyncHandler(
    async (req, res) => {
        const poruke = await porukaKorisnikaModel.find();
        const searchTerm = parseInt(req.params.searchTerm);

        res.send(poruke[searchTerm]);
    }
));

router.delete("/index/:searchTerm", asyncHandler(
    async (req, res) => {
        const searchTerm = parseInt(req.params.searchTerm);
        const poruke = await porukaKorisnikaModel.find();

        if (searchTerm >= 0 && searchTerm < poruke.length) {
            const productToDelete = poruke[searchTerm];
            await porukaKorisnikaModel.deleteOne({ _id: productToDelete._id });
            res.status(204).send();
        }
    }
));


export default router;