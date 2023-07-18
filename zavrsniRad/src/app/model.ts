export interface NarudzbaSve { /*interface potreban za praćenje ulogiranog korisnika, korisnika koji naručuje i dohvat njegove narudzbe */
    korisnik: reg,
    narudzba: narudzba,
    proizvodi: kosarica[],
    narudzbaObradena: boolean,
    subtotal: number,
    tax: number,
    total: number
}

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

export interface log { /*interface potreban za prijavu korisnika */
    email: string,
    lozinka: string
}

export interface proizvodi {/*interface potreban za prikazivanje proizvoda na njihov klik */
    imeProizvoda: string,
    kratakOpisProizvoda: string,
    opis: string,
    slika: string,
    cijena: number,
    respolozivo: number,
    ukupno: number,
    kolicina: number;
    sifra: number;
    kategorijaID: number;
}

export interface kosarica { /**interface za prikazivanje proizvoda u kosarici, prije samog placanja */
    sifra: number,
    slika: string,
    kratakOpisProizvoda: string,
    cijena: number,
    kolicina: number,
    ukupno: number
}

export interface kategorijaProizvoda { /*interface potreban za dodavanje imena kategorija proizvoda sa font awesome ikonama */
    id: number,
    naziv: string,
    aktivan: boolean,
    fontAwesomeIcon: string;
}

export interface narudzba { /*intrface potreban za spremanje podataka o kupcu kod checkout-a */
    ime: string,
    prezime: string,
    grad: string,
    postanskiBroj: number | undefined,
    adresa: string,
    brojTelefona: number | undefined
}


export interface porukaKorisnika {
    ime: string,
    email: string,
    porukaKorisnika: string
}

export interface porukaAdministratora {
    ime: string,
    email: string,
    porukaKorisnika: string
    porukaZaKorisnika: string
}