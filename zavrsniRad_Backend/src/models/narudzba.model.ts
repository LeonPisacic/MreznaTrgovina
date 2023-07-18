import { Schema, model } from "mongoose";

export interface narudzba { /* interface potreban za spremanje podataka o kupcu kod checkout-a */
    ime: string;
    prezime: string;
    grad: string;
    postanskiBroj: number | undefined;
    adresa: string;
    brojTelefona: number | undefined;
}


export const narudzbaSchema = new Schema<narudzba>(
    {
        ime: { type: String, required: true },
        prezime: { type: String, required: true },
        grad: { type: String, required: true },
        postanskiBroj: { type: Number, required: true },
        adresa: { type: String, required: true },
        brojTelefona: { type: Number, required: true },
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

export const narudzbaModel = model<narudzba>('narudzba', narudzbaSchema);