import { Schema, model } from "mongoose";

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
export const registracijaSchema = new Schema<reg>(
    {
        ime: { type: String, required: true },
        prezime: { type: String, required: true },
        email: { type: String, required: true },
        grad: { type: String, required: true },
        postanskiBroj: { type: Number, required: true },
        adresa: { type: String, required: true },
        brojMobitela: { type: Number, required: true },
        lozinka: { type: String, required: false },
        ponoviLozinku: { type: String, required: false },
        roll: { type: String, required: true }
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


export const registracijaModel = model<reg>('registracija', registracijaSchema);