import { Schema, model } from "mongoose";

import { registracijaSchema } from "./registracija.model";
import { kosaricaSchema } from "./kosarica.model";
import { narudzbaSchema } from "./narudzba.model";

export interface reg { /*interface potreban za registraciju korisnika */
    ime: string,
    prezime: string
    email: string;
    grad: string;
    postanskiBroj: number | undefined;
    adresa: string;
    brojMobitela: number | undefined;
    lozinka: string;
    ponoviLozinku: string;
    roll: string;
}

export interface narudzba {
    /* interface potreban za spremanje podataka o kupcu kod checkout-a */
    ime: string;
    prezime: string;
    grad: string;
    postanskiBroj: number | undefined;
    adresa: string;
    brojTelefona: number | undefined;
}

export interface kosarica {
    /** interface za prikazivanje proizvoda u kosarici, prije samog placanja */
    sifra: number;
    slika: string;
    kratakOpisProizvoda: string;
    cijena: number;
    kolicina: number;
    ukupno: number;
}

export interface NarudzbaSve { /* interface potreban za pracanje ulogiranog korisnika, korisnika koji narucuje i dohvat njegove narudzbe */
    korisnik: reg;
    narudzba: narudzba;
    proizvodi: kosarica[];
    narudzbaObradena: boolean,
    subtotal: number,
    tax: number,
    total: number
}

export const povijestNarudzbi = new Schema<NarudzbaSve>(
    {
        korisnik: { type: registracijaSchema, required: true },
        narudzba: { type: narudzbaSchema, required: true },
        proizvodi: { type: [kosaricaSchema], required: true }, //array
        narudzbaObradena: { type: Boolean, required: true },
        subtotal: { type: Number, required: true },
        tax: { type: Number, required: true },
        total: { type: Number, required: true },
    },
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
        timestamps: true,
    }
);

export const povijestNarudzbiModel = model<NarudzbaSve>('povijestNarudzbi', povijestNarudzbi)