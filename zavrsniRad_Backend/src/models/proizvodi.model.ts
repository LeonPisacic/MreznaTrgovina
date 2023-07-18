import { Schema, model } from "mongoose";

export interface proizvodi {/*interface potreban za punjenje podatcima o nekom proizvodu */
    imeProizvoda: string,
    kratakOpisProizvoda: string,
    opis: string,
    slika: string,
    cijena: number,
    respolozivo: number,
    ukupno: number,
    kolicina: number;
    //kolicin je uvijek 1, ako korisnik zeli vise komada, dodat ce naknadno više, ne moze biti 0 jer se onda u kosarici nece dobro racunati subtota,total i tax iznosi
    sifra: number;
    kategorijaID: number;
}

export const proizvodiSchema = new Schema<proizvodi>(
    {
        imeProizvoda: { type: String, required: true },
        kratakOpisProizvoda: { type: String, required: true },
        opis: { type: String, required: true },
        slika: { type: String, required: true },
        cijena: { type: Number, required: true },
        respolozivo: { type: Number, required: true },
        ukupno: { type: Number, required: true },
        kolicina: { type: Number, required: true },
        sifra: { type: Number, required: true },
        kategorijaID: { type: Number, required: true },
    }, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
}
);


export const proizvodiModel = model<proizvodi>('proizvodi', proizvodiSchema);