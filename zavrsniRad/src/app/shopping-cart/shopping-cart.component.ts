import { Component, Injectable, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { kosarica } from '../model';
import swal from 'sweetalert';
import { AdministracijaComponent } from '../administration/administration.component';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-kosarica',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})

export class KosaricaComponent implements OnInit {

  /*boolean vrijednost koju koristimo kako bih provjeravali postoji li uopce ijedan proizvod
    u kosarici i sukladno sa tim ispisivali 'trenutno u kosarici nema prozvoda' + slika */
  imaProizvoda: boolean = false;
  uCheckOutu: boolean = false; /*boolean vrijednost koju koristimo jer zelimo prikazati 'obrisi' ikonu unutar kosarice, ali ne i checkout-a */
  checkoutStatus: boolean = false;

  tax: number = 0;
  subtotal: number = 0;
  total: number = 0;
  jeUlogiran: boolean = false;
  jeGost: boolean = false;

  constructor(public data: DataService, public administracija: AdministracijaComponent, private router: Router) { }

  public poljeProizvodaKosarica: kosarica[] = [];
  public kosaricaProizvod: kosarica[] = [];

  ngOnInit() {
    this.refresh();

    const { subtotal, tax, total } = this.data.subotalTaxTotal(); /*definiramo varijable i dodajemo im vrijednost iz metode izracunaj() */
    this.subtotal = subtotal; //dodjeljuemo vrijednost varijabli kreiranih 25-27.linija ovim kreiranim u objektu
    this.tax = tax;
    this.total = total;

    if (this.poljeProizvodaKosarica.length > 0) { /*ako ima proizvoda boolean vrijednost se postavlja na 0, a ista se koristi u HTML-u */
      this.imaProizvoda = true;
    }
    else {
      this.imaProizvoda = false;
    }

    for (let i = 0; i < this.kosaricaProizvod.length; i++) {
      let duljina: number;
      this.data.dohvatiProizvode().subscribe((SviProizvodi) => {
        duljina = SviProizvodi.length;

        for (let j = 0; j < duljina; j++) {

          /*ako je sifra iz polja 'kosaricaProizvod' ista kao neka sifra unutar polja objekata 'proizvodi' i data service */
          if (this.kosaricaProizvod[i].sifra === SviProizvodi[j].sifra) {
            this.data.proizvodiIzKosarice.push(SviProizvodi[j]); /*push-aj tu vrijednost u array tipa 'proizvodi' kreiran 
            u data.service */
          }
          /*ovo radimo iz razloga jer mi je bilo potrebno polje objekata tipa 'proizvodi' od proizvoda koje sam kupio, a koje sam do sada
          spremao preko interface-a 'kosarica' koji ne sadrzi vrijednost 'respolozivo' te tako nisam mogao manipulirati istom postavkom
          te tako ni ne smanjivati vrijednost respolozivih komada kada se neki proizvod kupi, sad je to moguce zbog 'proizvodiIzKosarice'*/
        }
      });
    }

    this.data.ulogiranKorisnikChange.subscribe(
      {
        next: (resp) => {
          this.jeUlogiran = resp;
        }
      });

  }

  refresh() {

    this.kosaricaProizvod = this.data.dohvatiKosaricaProizvod(); //dohvacanje proizvoda iz kosarice
    this.poljeProizvodaKosarica = []; /*praznimo kosaricu nakon svakog pozivanja ove funckije, kako bih se mogla dohvatiti lista svih 'novih proizvoda
    , odnosno da se primi update-ana verzija novih proizvoda (bez onoga kojeg smo obrisali) */

    for (let i = 0; i < this.kosaricaProizvod.length; i++) {
      this.poljeProizvodaKosarica.push({
        ...this.kosaricaProizvod[i], /*punimo podatke sa osvjezenim podacima (bez onog proizvoda kojeg smo obrisali) */
      });
    }
    this.data.kosaricaProizvod = this.poljeProizvodaKosarica; /*da broj koji povecamo ili oduzmemo unutar kosarice ostane isti ako odemo negdje izvan
    //kosarica komponente i vratimo se */
  }

  smanjiKolicinu(idx: number) {
    if (this.poljeProizvodaKosarica[idx].kolicina !== 1) { /*minimalna kolicina koja moze biti je 1, ako korisnik zeli manju kolicinu od 1, odnosno 
    izbrisati proizvod, ima za to predvideni gumb */
      this.poljeProizvodaKosarica[idx].kolicina--;
      this.data.brojacKosarica--;

      this.subtotal = 0;
      for (let i = 0; i < this.poljeProizvodaKosarica.length; i++) {
        this.subtotal += this.poljeProizvodaKosarica[i].kolicina * this.poljeProizvodaKosarica[i].cijena;
      }
      this.tax = this.subtotal * 0.25;
      this.total = this.subtotal + this.tax;
    }
  }

  povecajKolicinu(idx: number) {
    this.poljeProizvodaKosarica[idx].kolicina++;
    this.data.brojacKosarica++;

    this.subtotal = 0;
    for (let i = 0; i < this.poljeProizvodaKosarica.length; i++) {
      this.subtotal += this.poljeProizvodaKosarica[i].kolicina * this.poljeProizvodaKosarica[i].cijena;
    }
    this.tax = this.subtotal * 0.25;
    this.total = this.subtotal + this.tax;
  }

  obrisi(idx: number) {
    const trenutniProizvod = this.data.kosaricaProizvod[idx];

    swal({
      title: "Jesi li siguran?",
      text: "Jesi li siguran da želiš izbrisati ovaj proizvod?",
      icon: "warning",
      buttons: ["Odustani", "OK"],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          //Remove the product from the cart
          this.data.obrisiProizvodIzKosarice(idx)
          //refresh the cart 
          this.refresh();

          //sukladno s kolicinom mjenjanje natpisa u broju itema u kosarici
          if (trenutniProizvod.kolicina == 1) {
            this.data.brojacKosarica -= 1;
          }
          else { /*ako smo kupili vise kolicina nego proizvoda, broj kod kosarice (span) se umanjuje za tolko */
            this.data.brojacKosarica -= trenutniProizvod.kolicina;
          }
          // Recalculate the subtotal, tax, and total
          this.subtotal = 0;

          for (let i = 0; i < this.poljeProizvodaKosarica.length; i++) {
            this.subtotal += this.poljeProizvodaKosarica[i].kolicina * this.poljeProizvodaKosarica[i].cijena;
          }
          this.tax = this.subtotal * 0.25;
          this.total = this.subtotal + this.tax;

          //ako se izbrise zadnji proizvod iz kosarice, ispisuje se novi izgled kosarica 'Tvoja kosarica je prazna'
          if (this.poljeProizvodaKosarica.length === 0) {
            this.imaProizvoda = false;
          }
          swal("Proizvod je obrisan iz kosarice!", {
            icon: "success",
          });
        }
      });
  }

  checkout(vrijednost: boolean) {
    if (!this.data.ulogiranKorisnik) {
      swal("Na koji način želiš dovršiti svoju narudžbu?", {
        buttons: {

          nastaviKaoGost: {
            text: "Nastavi kao gost",
            value: "nastaviKaoGost",
          },
          ulogirajSe: {
            text: "Ulogiraj se",
            value: "ulogirajSe",
          },
          cancel: true,
        },
      })
        .then((value) => {
          switch (value) {
            case "ulogirajSe": {
              this.router.navigate(["/login"]);
              break;
            }
            case "nastaviKaoGost":
              this.jeGost = true;
              this.uCheckOutu = true;
              this.checkoutStatus = vrijednost;
              break;
          }
        });
    }

    else {
      this.uCheckOutu = true;
      this.checkoutStatus = vrijednost;
    }
  }



}




