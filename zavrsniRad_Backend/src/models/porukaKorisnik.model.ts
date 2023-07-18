import { Schema, model } from "mongoose";

export interface porukaKorisnika {
    ime: string,
    email: string,
    porukaKorisnika: string
}

export const porukaKorisnikaShema = new Schema<porukaKorisnika>(
    {
        ime: { type: String, required: true },
        email: { type: String, required: true },
        porukaKorisnika: { type: String, required: true }
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

export const porukaKorisnikaModel = model<porukaKorisnika>('porukaKorisnika', porukaKorisnikaShema)