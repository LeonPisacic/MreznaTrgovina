import { Injectable, OnInit } from '@angular/core';
import { NarudzbaSve, kategorijaProizvoda, kosarica, narudzba, porukaAdministratora, porukaKorisnika, proizvodi, reg } from '../model';
import { BehaviorSubject, Observable, Subject, map, tap } from 'rxjs';
import swal from 'sweetalert';
import { HttpClient } from '@angular/common/http';
import { PROIZVODI_URL, REGISTRIRANI_KORISNICI_URL, SVE_KATEGORIJE_URL } from '../shared/constants/urls';
@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient) { }

  /*globalni service koji nam glumi 'bazu podataka', napravili smo ga globalnim kako bi mogli pristupiti istom u drugim komponentama */

  // Subject is a special type of Observable that allows values to be multicasted to many Observers
  logiranKorisnikChange: Subject<reg> = new Subject();
  ulogiranKorisnikChange: Subject<boolean> = new Subject();
  odabranaKategorijaChange: Subject<number> = new Subject();
  odabraniKorisnikNaruduzbaChange: Subject<reg> = new Subject();
  pratiLogiranuVrijednost: Subject<boolean> = new Subject();

  trenutniIndexProizvoda: number = -1
  editProizvod: boolean = false;
  korisnikPisaoAdminu: boolean = false;
  brojacKosarica: number = 0;
  poslanaNarudzba: boolean = false;
  jeUlogiran: boolean = false;
  adminKontaktiraoKorisnika: boolean = false;
  proizvodiIzKosarice: proizvodi[] = [];
  poljePorukaKorisnika: any[] = [];
  index!: number;


  sendIndex(index: number) {
    this.index = index;
  }


  //prazan objekt, kojeg punimo kako bih dobili informacije o trenutno odabranom (kliknutom) proizvodu
  trenutnoOdabranProizvod: proizvodi = {
    ukupno: 0,
    kolicina: 0,
    sifra: 0,
    imeProizvoda: "",
    kratakOpisProizvoda: "",
    slika: "",
    cijena: 0,
    respolozivo: 0,
    opis: "",
    kategorijaID: 0,
  };

  //prazan objekt kojeg punimo nakon sto potvrdimo narudzbu, podatke koje punimo su podaci o kupcu kod checkout-a
  narudzba: narudzba = {
    ime: '',
    prezime: '',
    grad: '',
    postanskiBroj: undefined,
    adresa: '',
    brojTelefona: undefined
  }


  /* prazan objekt u kojeg punimo podatke nakon što kliknemo na neki proizvod, provjeravamo u koju kategoriju spada kliknuti proizvod
   te njegovu kategoriju, odnosno podatke kategorije punimo u ovaj objekt*/
  public kategorijaObjekt: kategorijaProizvoda = {
    id: 0,
    naziv: "",
    aktivan: true,
    fontAwesomeIcon: ""
  }

  /* objekt u kojem pratimo trenutani logiranog korisnika  */
  public logiranKorisnik: reg = {
    ime: "",
    prezime: "",
    email: "",
    grad: "",
    postanskiBroj: undefined,
    adresa: "",
    brojMobitela: undefined,
    lozinka: "",
    ponoviLozinku: "",
    roll: "",
  }


  /*metoda koja postvalja objekt tipa 'reg' na pocetnu vrijednost (resetira ga) */
  resetLogiranKorisnik() {
    this.logiranKorisnik = {
      ime: "",
      prezime: "",
      email: "",
      grad: "",
      postanskiBroj: undefined,
      adresa: "",
      brojMobitela: undefined,
      lozinka: "",
      ponoviLozinku: "",
      roll: "",
    }
    this.logiranKorisnikChange.next(this.logiranKorisnik);
    /*subject logiraniKorisnikChange prati promjene koje su se desile u varijabli this.logiraniKorisnik i obavještava sve
    koji su pretplaćeni na promjene koje su se desile unuter tog subject-a */
  }

  /*metoda za mjenjanje natpisa kada jos korisnik nije ulogiran */
  postaviLogiranKorisnik(korisnik: reg) {
    this.logiranKorisnik = korisnik; /*varijabli logiraniKorisnik proslijedujemo vrijednost, odnosno objekt trenutno logiranog korisnika */
    this.logiranKorisnikChange.next(this.logiranKorisnik);
    /*logiraniKorisnikChange prima vrijednost objekta trenutnog korisnika (logiraniKorisnik) i proslijeduje tu vrijednost 
    svim komponentama koji su pretplaceni na tu 'promjenu' */
    /*The subject next method is used to send messages to an observable which are then sent
     to all angular components that are subscribers of that observable. */
  }

  public ulogiranKorisnik: boolean = false;

  /*metoda za mjenjanje natpisa u navbar-u kada ja korisnik već ulogiran u sustav */
  setUlogiranKorisnik(status: boolean) {
    this.ulogiranKorisnik = status; /*pridodajemo vrijednost ulogiranKorisnik varijable, argumentu metode (status) */
    this.ulogiranKorisnikChange.next(this.ulogiranKorisnik);
    /*The subject next method is used to send messages to an observable which are then sent
 to all angular components that are subscribers of that observable. */
  }

  /* */

  /*metoda za vracanje trenutacnog korisnika, onoga koji je ulogiran  */
  dohvatiKorisnika() {
    /*subject prati i zapisuju sve promjene nastale u objektu logiranKorisnik te šalje vrijednost svima koji su prtplaćeni na promjene subject-a */
    this.odabraniKorisnikNaruduzbaChange.next(this.logiranKorisnik);
    return this.logiranKorisnik; /*vracamo promjenjenju vrijednost varijable 'logiraniKorisnik' */
  }


  /*metoda zasluzna za slanje kopije (slice) objekta svih korisnika (korisnici) - admin ili korisnik */
  dohvatiKorisnike(): Observable<reg[]> {
    return this.http.get<any>(REGISTRIRANI_KORISNICI_URL) // response is the array of object but only with predefined users (two);
  }

  jeGost: boolean = false;

  dodajKorisnika(korisnik: reg): Observable<reg> {
    if (!this.jeGost) {
      korisnik.roll = "korisnik";
    }

    return this.http.post<reg>(REGISTRIRANI_KORISNICI_URL, korisnik);
  }

  obrisiKorisnika(index: number): Observable<reg[]> {
    return this.http.delete<any>(`${'http://localhost:5000/api/registracija'}/${index}`);
  }

  /*varijabla tipa array interface (kosarica) koja je zaduzena za dohvaćanje proizvoda iz kosarice, kojim kasnije manipuliramo */
  public kosaricaProizvod: kosarica[] = []

  //metoda za izracunavanje subtotal, tax i total varijabli
  subotalTaxTotal() {
    let subtotal = 0;

    for (let i = 0; i < this.kosaricaProizvod.length; i++) {
      subtotal += this.kosaricaProizvod[i].kolicina * this.kosaricaProizvod[i].cijena;
    }
    const tax = subtotal * 0.25; // 25% je porez
    const total = tax + subtotal;
    return { subtotal, tax, total }; /**vracanje vrijednosti varijabla */
  }

  /*metoda zasluzna za vracanja proizvoda iz kosarice, ali vracamo kopiju podataka, a ne stvarnu vrijednost (slice) */
  dohvatiKosaricaProizvod() {
    return this.kosaricaProizvod.slice();
  }

  obrisiProizvodIzKosarice(idx: number) {
    this.kosaricaProizvod.splice(idx, 1); /* brisemo proizvod na nekom index-u (idx) i brisemo jedan proizvod (1) */
  }

  isprazniKosaricu() { /*metoda potrebna za resetiranje proizvoda iz kosarice kad kupac izvrsi narudzbu */
    this.kosaricaProizvod = [];
  }

  /**metoda koja sluzi za vracanje forme nekog proizvoda, koja je već ispunjena, ovu metodu koristimo kod uređivanja već postojeceg
    proizvoda u admin načinu rada  */
  dohvatiOpisProizvoda(proizvod: proizvodi) {
    this.trenutnoOdabranProizvod = proizvod;
  }

  vratiTrenutnoOdabraniProizvod() {
    return this.trenutnoOdabranProizvod;
  }

  /**metoda za punjenje varijable 'kosaricaProizvod' sa podacima dobivenih iz argumenta 'prozvodi' */
  postaviTrenutnoDodanProizvod(proizvodi: proizvodi) {

    let duljina = this.kosaricaProizvod.length;

    if (duljina == 0) { /*za prvi proizvod */
      this.kosaricaProizvod[duljina] = { /*varijabli tipa 'kosarica' (kosaricaProizvod) dodjeljujemo parametre tipa interface 'proizvod'
      a to radimo kako bi ih kasnije mogli usporedivat u if statement-u  */
        sifra: proizvodi.sifra,
        slika: proizvodi.slika,
        cijena: proizvodi.cijena,
        kratakOpisProizvoda: proizvodi.kratakOpisProizvoda,
        kolicina: proizvodi.kolicina,
        ukupno: proizvodi.ukupno
      }

    }

    else { /*ako je duljina veca od 1, odnosno ako se ne dodaje prvi proizvod u kosaricu */

      let postoji: boolean = false;
      let index: number = 0

      for (let i = 0; i < this.kosaricaProizvod.length; i++) {
        /*ovo radimo kako se isti proizvod nebi napisao dva puta u kosarici, vec samo inkrementiramo kolicinu istoga za 1  */
        if (this.kosaricaProizvod[i].sifra == proizvodi.sifra) { /*zbog ovoga smo dodjeljivali vrijednost paramtetrimau kosaricaProizvod */
          postoji = true;
          index = i;
        }
      }

      if (postoji) { /*ako naidemo na proizvod kojeg vec imamo u kosarici */
        this.kosaricaProizvod[index].kolicina = this.kosaricaProizvod[index].kolicina + 1 /*inkrementiramo kolicinu za 1 */
        this.kosaricaProizvod[index].ukupno = this.kosaricaProizvod[index].kolicina * this.kosaricaProizvod[index].cijena
        /* i update-amo cijenu */
      }

      else { /*ako proizvod koji zelimo dodati ne postoji vec u kosarici, jednostavno punimo varijablu 'kosaricaProizvod sa podacima
      o tome proizvodu, klasicno dodavanje proizvoda, i prikazivanje istog u kosarica.component */
        this.kosaricaProizvod[duljina] = {
          sifra: proizvodi.sifra,
          slika: proizvodi.slika,
          cijena: proizvodi.cijena,
          kratakOpisProizvoda: proizvodi.kratakOpisProizvoda,
          kolicina: proizvodi.kolicina,
          ukupno: proizvodi.ukupno
        }
      }
    }
  }

  /**metoda zaduzena za dodavanje proizvoda u kosaricu */
  dodajProizvodUKosaricu(index: number) {

    this.dohvatiProizvode().subscribe((proizvodi: proizvodi[]) => {
      if (!(this.logiranKorisnik.roll === "admin") && proizvodi[index].respolozivo !== 0) {
        this.postaviTrenutnoDodanProizvod(proizvodi[index]);
        this.brojacKosarica += 1;
        swal("Proizvod je dodan u  vašu košaricu");
      }
      else if (this.ulogiranKorisnik && this.logiranKorisnik.roll === "admin") {
        swal("Admin nije u mogućnosti kupovati proizvode", "", "error")
      }
    });
  }

  pracenjeUpdateProizvoda: Subject<proizvodi[]> = new BehaviorSubject<proizvodi[]>([]);

  /*dohvacanje svih proizvoda koji se nalaze na stranici */
  dohvatiProizvode(): Observable<proizvodi[]> {
    return this.http.get<proizvodi[]>(PROIZVODI_URL).pipe(
      tap((proizvodi: proizvodi[]) => {
        this.pracenjeUpdateProizvoda.next(proizvodi);
      })
    );
  }



  /*dohvacanje proizvoda (kod kojeg smo kliknuli edit) pod index-om na koji je smjesten */
  dohvatiProizvod(idx: number) {
    const url = `${'http://localhost:5000/api/proizvodi/index'}/${idx}`;
    return this.http.get<proizvodi>(url);
  }


  /*uredivanje vec postojeceg odabranog proizvoda u admin načinu rada (edit-proizvoda.component) */
  urediProizvod(proizvod: proizvodi, idx: number) {
    const url = `${'http://localhost:5000/api/proizvodi/index'}/${idx}`;
    return this.http.put<any>(url, proizvod);
  }

  urediViseProizvoda(proizvod: proizvodi[]) {
    const url = 'http://localhost:5000/api/proizvodi'

    return this.http.put<any>(url, proizvod)
  }


  /*metoda zasluzna za postavljanje novog proizvoda koji dodaje admin u admin načinu rada (edit-proizvoda.component) */
  postaviDodanNoviProizvod(proizvod: proizvodi) {
    return this.http.post<any>(PROIZVODI_URL, proizvod);
  }

  /*brisanje odabranog proizvoda u admin načinu rada (administracija.component) */

  obrisiProizvod(index: number) {
    return this.http.delete<any>(`${'http://localhost:5000/api/proizvodi/index'}/${index}`);
  }

  obrisiPorukuKorisnika(index: number) {
    return this.http.delete<any>(`${'http://localhost:5000/api/porukaKorisnika/index'}/${index}`)
  }

  dohvatiOdabranuPorukuKorisnika(idx: number) {
    return this.http.get<any>(`${'http://localhost:5000/api/porukaKorisnika/index'}/${idx}`)
  }

  dohvatiOdabranuAdminPoruku(idx: number) {
    return this.http.get<any>(`${'http://localhost:5000/api/porukaAdministratora/index'}/${idx}`)
  }

  /* dohvacanje trenutno (kliknutog) index-a proizvoda  */
  setTrenutniIndexProizvoda(id: number) {
    this.trenutniIndexProizvoda = id;
  }
  /*vracanje trenutnog index-a proizvoda */
  dohvatiTrenutniIndexProizvoda() {
    return this.trenutniIndexProizvoda
  }

  resetTrenutniIndexProizvoda() {
    return this.trenutniIndexProizvoda = -1;
  }

  /*dohvacanje vrijednosti za edit proizvoda, vrijednost 'false' se koristi za kreiranje novog proizvoda, dok 'true' za izmjenu 
  vec postojeceg proizvoda (administracija.component) */
  setEditProizvod(status: boolean) {
    this.editProizvod = status;
  }

  /*vracanje boolean vrijednosti (koristi se u edit-proizvoda.component) */
  dohvatiEditProizvod() {
    return this.editProizvod
  }

  /* */

  /*metoda zasluzna za vracanje objekta kliknute kategorije (kod pop out menia) */
  /*funckija koju pozivamo u HTML-U na click neke kategorije, tad spremamo tu vrijednost
    (kategorija) u metodu vratiTrenutnuKategorijuProizvoda, kojom kasnije sukladno sa 
    kategorijom ispisujemo naziv kategorije na filtiranoj novoj stranici (<h3>) */
  dohvatiTrenutnuKategorijuProizvoda(kategorija: kategorijaProizvoda) {
    this.kategorijaObjekt = kategorija;
  }

  /**vracanje objekta kliknute kategorije */
  vratiTrenutnuKategorijuProizvoda() {
    return this.kategorijaObjekt;
  }

  /*vrati sve kategorije proizvoda (sve koje postoje) */
  dohvatiKategorijeProizvoda() {
    return this.http.get<kategorijaProizvoda[]>(SVE_KATEGORIJE_URL); /*vrati kopiju podataka, a ne stvarnu vrijednost (slice) */
  }

  public kategorija: number = 0;

  /* metoda zasluzna za dohvacanje id kategorije, kako bi se proizvodi kasnije u componentama (navbar i glavno) mogli filtrirati
  kroz iste */
  setKategorijaProizvoda(id: number) {
    this.kategorija = id;
    this.odabranaKategorijaChange.next(this.kategorija);
    /**subject prati promjene nastale u varijabli kategorija (par linija gore deklarirana) i proslijeduje promjenjenu vrijednost
      svima pretplaceni na promjene nastale u subject-u 'odabranKategorijaChange' */
  }

  public narudzbaSve: NarudzbaSve[] = [];


  //post-aj podatke dobivane iz argumenata funckije na url (varijabla url)
  spremiNarudzbu(korisnik: reg, narudzba: narudzba, kosarica: kosarica[], narudzbaObradena: boolean, subtotal: number, tax: number, total: number): Observable<NarudzbaSve[]> {
    const url = ('http://localhost:5000/api/povijestNarudzbi');
    const narudzbaSve: NarudzbaSve = {
      korisnik: korisnik,
      narudzba: narudzba,
      proizvodi: kosarica,
      narudzbaObradena: narudzbaObradena,
      subtotal: subtotal,
      tax: tax,
      total: total,
    };

    return this.http.post<NarudzbaSve[]>(url, narudzbaSve);
  }

  /*dohvati sve narudzbe koje se nalaze na navedenom URL-u*/
  dohvatiNarudzbe(): Observable<NarudzbaSve[]> {
    return this.http.get<NarudzbaSve[]>('http://localhost:5000/api/povijestNarudzbi')
  }


  promjeniDioNarudzbe(narudzba: NarudzbaSve[]): Observable<NarudzbaSve[]> {
    const url = "http://localhost:5000/api/povijestNarudzbi"

    return this.http.put<any>(url, narudzba);
  }

  posaljiKorisnikovuFormu(poruka: porukaKorisnika): Observable<porukaKorisnika[]> {
    const url = "http://localhost:5000/api/porukaKorisnika";

    return this.http.post<porukaKorisnika[]>(url, poruka);
  }

  brojacPorukaAdmin: number = 0;
  dohvatiKorisnickeForme(): Observable<porukaKorisnika[]> {
    const url = "http://localhost:5000/api/porukaKorisnika"; //how to get length of items which are on these URL?

    return this.http.get<porukaKorisnika[]>(url).pipe(
      map(items => {
        this.brojacPorukaAdmin = items.length;
        return items;
      })
    );
  }

  posaljiAdminPoruku(poruka: porukaAdministratora): Observable<porukaAdministratora[]> {

    const url = "http://localhost:5000/api/porukaAdministratora";

    return this.http.post<porukaAdministratora[]>(url, poruka);
  }
  dohvatiAdminPoruke(): Observable<porukaKorisnika[]> {
    const url = "http://localhost:5000/api/porukaAdministratora"; //how to get length of items which are on these URL?

    return this.http.get<porukaKorisnika[]>(url);
  }

}
