import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { kosarica, proizvodi, reg } from '../model';
import swal from 'sweetalert';
import { Subscription } from 'rxjs';
import { MainPageComponent } from '../all-products/all-products.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pocetna',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class PocetnaComponent implements OnInit {

  poljeProizvoda: proizvodi[] = []; /*polje koje punimo sa svim proizvodima a kasnije i ispisujemo proizvod po proizvod kroz *ngFor (html) */
  trenutnaKategorija: Subscription = new Subscription(); //subscription preko kojeg dobivamo promjene nastale unutar odabranaKategorijaChange subject-a
  idKategorije!: number;
  nemaProizvodaUTojKategoriji: boolean = false; /*boolean vrijednost koja se koristi za provjeru broja proizvoda u kategoriji
  ako je broj proizvoda 0 ispisuje se 'u ovoj kategoriji trenutacno nema proizvoda sa nekom slikom */

  constructor(public data: DataService, public glavno: MainPageComponent, private router: Router) {
    this.data.dohvatiProizvode().subscribe((proizvod) => {
      this.poljeProizvoda = proizvod.filter((_, index) => [0, 1, 5, 6, 19].includes(index));
    })
    /*metoda koja vraca array sa proizvodima u kosarici (dva su u startu predefinirana) */
  }

  sendIndex(index: number) { //metoda za slanje trenutno kliknutog indexa proizvoda, a to koristimo u opis-proizvoda.component
    this.data.index = index;
  }

  ngOnInit() {

    this.trenutnaKategorija = this.data.odabranaKategorijaChange.subscribe(
      {
        next: (resp) => {
          this.data.dohvatiProizvode().subscribe((proizvod) => {
            this.poljeProizvoda = proizvod.filter((_, index) => [0, 1, 5, 6, 19].includes(index)); //dodjeljemo vrijednost svih proizvoda
            let rez: proizvodi[] = []
            this.idKategorije = resp;

            if (this.idKategorije !== -1) { /*ako nije pocetna strana sa svim proizvodima (-1 joj je id) */
              rez = proizvod.filter((obj) => { //filtriramo polje sa svim proizvodima (po kategorijama)
                //  console.log(obj.kategorijaID === this.idKategorije)
                //vracamo vrijednost koja se podudara sa ID-em, ako je vrijednost true (proizvodi se podudaraju i proizvod se dodjeljuje toj kategoriji)
                return obj.kategorijaID === this.idKategorije
              });
            }

            if (this.poljeProizvoda.length === 0) { /*ako kategorija nema nijedan proizvod u sebi, boolean se postavlja na true,
             u tom slucaju se pomocu html-a mjenja prikaz   i prikazuje se 'trenutno u ovoj kategoriji ne postoje proizvodi' tekst*/
              this.nemaProizvodaUTojKategoriji = true;
            }
            else { /*ako kategorija proizvoda sadrzi proizvod/proizvode */
              this.nemaProizvodaUTojKategoriji = false
            }
          });

        }
      });

  }

  ngOnDestroy() {
    this.trenutnaKategorija.unsubscribe(); /*unsubscribe-amo se da ne trosimo nepotrebne resurse i potencijalno usporavamo aplikaciju */
  }

  /*metoda za dodavanje proizvoda u kosaricu, na temelju roll-e i ulogiranog/neulogiranog korisnika ispisuju se poruke */
  dodajProizvodUKosaricu(index: number) {
    this.sendIndex(index);

    if (!(this.data.logiranKorisnik.roll === "admin")) {
      this.data.postaviTrenutnoDodanProizvod(this.poljeProizvoda[index]); //postavljanje novog proizvoda u kosaricu
      this.data.brojacKosarica += 1;
      swal("Proizvod je dodan u  vašu košaricu");
    }
    else if (this.data.ulogiranKorisnik && this.data.logiranKorisnik.roll === "admin") {
      swal("Admin nije u mogućnosti kupovati proizvode", "", "error")
    }
  }

  //metoda koja omogucuje prikaz detalja o samom proizvod kada se klikne na proizvod(opis,kolicina...)
  detalji(proizvod: proizvodi) {
    this.data.dohvatiOpisProizvoda(proizvod);
  }

}
