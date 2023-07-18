import { Schema, model } from "mongoose";

export interface kategorijaProizvoda { /*interface potreban za dodavanje imena kategorija proizvoda sa font awesome ikonama */
    id: number,
    naziv: string,
    aktivan: boolean,
    fontAwesomeIcon: string;
}

export const kategorijaProizvodaSchema = new Schema<kategorijaProizvoda>(
    {
        id: { type: Number, required: true },
        naziv: { type: String, required: true },
        aktivan: { type: Boolean, required: true },
        fontAwesomeIcon: { type: String, required: true }
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

export const kategorijaProizvodaModel = model<kategorijaProizvoda>('kategorijaProizvoda', kategorijaProizvodaSchema);