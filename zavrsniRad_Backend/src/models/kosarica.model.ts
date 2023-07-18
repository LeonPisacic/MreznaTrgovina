import { Schema, model } from "mongoose";

export interface kosarica { /* interface za prikazivanje proizvoda u kosarici, prije samog placanja */
    sifra: number;
    slika: string;
    kratakOpisProizvoda: string;
    cijena: number;
    kolicina: number;
    ukupno: number;
}


export const kosaricaSchema = new Schema<kosarica>(
    {
        sifra: { type: Number, required: true },
        slika: { type: String, required: true },
        kratakOpisProizvoda: { type: String, required: true },
        cijena: { type: Number, required: true },
        kolicina: { type: Number, required: true },
        ukupno: { type: Number, required: true }
    }
    , {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    }
);

export const kosaricaModel = model<kosarica>('kosarica', kosaricaSchema)