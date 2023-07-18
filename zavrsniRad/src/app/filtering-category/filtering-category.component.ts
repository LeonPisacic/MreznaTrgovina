import { Component } from '@angular/core';
import { kosarica, proizvodi, reg } from '../model';
import { DataService } from '../service/data.service';
import swal from 'sweetalert';
import { Subscription } from 'rxjs';
import { MainPageComponent } from '../all-products/all-products.component';

@Component({
  selector: 'app-filtriranje-kategorija',
  templateUrl: './filtering-category.component.html',
  styleUrls: ['./filtering-category.component.css']
})
export class FiltriranjeKategorijaComponent {
  poljeProizvoda: proizvodi[] = []; /*polje koje punimo sa svim proizvodima a kasnije i ispisujemo proizvod po proizvod kroz *ngFor (html) */
  trenutnaKategorija: Subscription = new Subscription(); //subscription preko kojeg dobivamo promjene nastale unutar odabranaKategorijaChange subject-a
  idKategorije!: number;
  nemaProizvodaUTojKategoriji: boolean = false; /*boolean vrijednost koja se koristi za provjeru broja proizvoda u kategoriji
  ako je broj proizvoda 0 ispisuje se 'u ovoj kategoriji trenutacno nema proizvoda sa nekom slikom */

  logiranKorisnik: reg = { /*prazan objekt tipa 'reg' interface koji nam sluzi da pratimo ulogiranog korisnika, te sukladno
  sa time, omogucujemo/onemogucujemo dodavanje proizvoda u kosaricu*/
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
  };

  constructor(public data: DataService, public glavno: MainPageComponent) {
    /*metoda koja vraca array sa proizvodima u kosarici (dva su u startu predefinirana) */
  }

  sendIndex(index: number) { //metoda za slanje trenutno kliknutog indexa proizvoda, a to koristimo u opis-proizvoda.component
    this.data.index = index;
  }

  filtirajPoljeProizvoda(proizvod: proizvodi[]) {
    if (this.idKategorije !== -1) {
      this.poljeProizvoda = proizvod.filter((obj) => {
        return obj.kategorijaID === this.idKategorije;
      });
    }

    if (this.poljeProizvoda.length === 0) {
      this.nemaProizvodaUTojKategoriji = true;
    } else {
      this.nemaProizvodaUTojKategoriji = false;
    }
  }


  ngOnInit() {
    this.logiranKorisnik = this.data.dohvatiKorisnika();

    this.data.dohvatiProizvode().subscribe((proizvod) => {
      this.idKategorije = this.data.vratiTrenutnuKategorijuProizvoda().id;
      this.filtirajPoljeProizvoda(proizvod);
    });

    this.trenutnaKategorija = this.data.odabranaKategorijaChange.subscribe((resp) => {
      this.idKategorije = resp;
      this.data.dohvatiProizvode().subscribe((proizvod) => {
        this.filtirajPoljeProizvoda(proizvod);
      });
    });
  }

  ngOnDestroy() {
    this.trenutnaKategorija.unsubscribe(); /*unsubscribe-amo se da ne trosimo nepotrebne resurse i potencijalno usporavamo aplikaciju */
  }

  /*metoda za dodavanje proizvoda u kosaricu, na temelju roll-e i ulogiranog/neulogiranog korisnika ispisuju se poruke */
  dodajProizvodUKosaricu(index: number) {

    this.sendIndex(index);
    if (!(this.logiranKorisnik.roll === "admin")) {
      this.data.postaviTrenutnoDodanProizvod(this.poljeProizvoda[index]); //postavljanje novog proizvoda u kosaricu
      this.data.brojacKosarica += 1;
      swal("Proizvod je dodan u  vašu košaricu");
    }
    else if (this.data.ulogiranKorisnik && this.logiranKorisnik.roll === "admin") {
      swal("Admin nije u mogućnosti kupovati proizvode", "", "error")
    }
  }


  //metoda koja omogucuje prikaz detalja o samom proizvod kada se klikne na proizvod(opis,kolicina...)
  detalji(proizvod: proizvodi) {
    this.data.dohvatiOpisProizvoda(proizvod);
  }
}
