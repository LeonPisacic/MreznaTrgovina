import { Schema, model } from "mongoose";

export interface porukaAdministratora {
    ime: string,
    email: string,
    porukaKorisnika: string,
    porukaZaKorisnika: string
}

export const porukaAdministratorShema = new Schema<porukaAdministratora>(
    {
        ime: { type: String, required: true },
        email: { type: String, required: true },
        porukaKorisnika: { type: String },
        porukaZaKorisnika: { type: String, required: true }
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

export const porukaAdministratorModel = model<porukaAdministratora>('porukaAdministratora', porukaAdministratorShema)