import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert';
import { kosarica, narudzba, reg } from '../model';
import { DataService } from '../service/data.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { KosaricaComponent } from '../shopping-cart/shopping-cart.component';
import { AdministracijaComponent } from '../administration/administration.component';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  @ViewChild("f") signUpForm?: NgForm; /*local reference zapisan u HTML-u */

  constructor(public data: DataService,
    private router: Router,
    public kosarica: KosaricaComponent,
    private administracija: AdministracijaComponent,
  ) { }

  public naruceniProizvodi: kosarica[] = []; //polje tipa interface 'kosarica' u koje spremamo proizvode koje je korisnik narucio
  tax: number = 0;
  subtotal: number = 0;
  total: number = 0;
  narudzbaObradena: boolean = false;

  narudzba: narudzba = { //prazan objekt tipa interface 'narudzba' u kojeg punimo podatke o korisniku koji kupuje (forma kod checkout-a)
    ime: '',
    prezime: '',
    grad: '',
    postanskiBroj: undefined,
    adresa: '',
    brojTelefona: undefined
  }

  public korisnikGost: reg = {
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

  ngOnInit() {

    this.naruceniProizvodi = this.kosarica.poljeProizvodaKosarica; /*varijabli 'polje2' proslijedujemo array iz komponente kosarica sa 
    svim proizvodima koji se nalaze unutar kosarice, u svrhu izracunavanje vrijednosti subtotal,tax and total */

    for (let i = 0; i < this.naruceniProizvodi.length; i++) {
      this.subtotal += this.naruceniProizvodi[i].kolicina * this.naruceniProizvodi[i].cijena;
      this.tax = this.subtotal * 0.25 /*25% je porez */
      this.total = this.tax + this.subtotal;
    }

  }

  submitNarudzbe() {
    if (!this.kosarica.jeGost) {
      this.data.jeGost = false;
      this.narudzba.ime = this.data.logiranKorisnik.ime
      this.narudzba.prezime = this.data.logiranKorisnik.prezime
      this.narudzba.grad = this.data.logiranKorisnik.grad
      this.narudzba.postanskiBroj = this.data.logiranKorisnik.postanskiBroj
      this.narudzba.adresa = this.data.logiranKorisnik.adresa
      this.narudzba.brojTelefona = this.data.logiranKorisnik.brojMobitela

      //working
      this.data.spremiNarudzbu(this.data.dohvatiKorisnika(), this.narudzba, this.naruceniProizvodi, this.narudzbaObradena, this.subtotal, this.tax, this.total).subscribe((data) => { });

    }
    else {

      this.narudzba = {
        ime: this.korisnikGost.ime,
        prezime: this.korisnikGost.prezime,
        grad: this.korisnikGost.grad,
        adresa: this.korisnikGost.adresa,
        postanskiBroj: this.korisnikGost.postanskiBroj,
        brojTelefona: this.korisnikGost.brojMobitela
      };
      this.korisnikGost.roll = "gost";
      this.data.jeGost = true;
      this.data.dodajKorisnika(this.korisnikGost).subscribe((data) => {

        this.data.spremiNarudzbu(data, this.narudzba, this.naruceniProizvodi, this.narudzbaObradena, this.subtotal, this.tax, this.total).subscribe((data2) => {
          this.data.dohvatiKorisnike().subscribe((data3) => {
            let indexGosta = 0;

            for (let i = 0; i < data3.length; i++) {
              if ((data as any)._id === (data3[i] as any)._id) { //usporedivanje ID narudzbe

                indexGosta = i;

              }
            }
            this.data.obrisiKorisnika(indexGosta).subscribe();
          })
        });
      });
    }

    // Decrease product quantities
    for (let i = 0; i < this.data.proizvodiIzKosarice.length; i++) {
      for (let j = 0; j < this.data.proizvodiIzKosarice.length; j++) {
        if (this.data.proizvodiIzKosarice[i].sifra === this.data.proizvodiIzKosarice[j].sifra) {
          this.data.proizvodiIzKosarice[j].respolozivo -= this.naruceniProizvodi[i]?.kolicina || 0;
        }
      }
    }

    this.data.pracenjeUpdateProizvoda.subscribe((resp) => { /*UPDATANJE KOLICINE PROIZVODA KOJIH SAM KUPIO */
      this.data.urediViseProizvoda(this.data.proizvodiIzKosarice).subscribe();
    });

    this.data.proizvodiIzKosarice = [];
    this.administracija.refresh();
    this.data.isprazniKosaricu();
    this.data.brojacKosarica = 0;

    swal("Narudžba je uspješno izvršena", "Svoj paket možeš očekivati od 3-5 radna dana", "success");
    this.router.navigate([""]);
  }

}




