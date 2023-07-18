import { Component, ViewChild, Injectable, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { log, reg } from '../model'; /*include-anje nasih interface-ova */
import { NgForm } from '@angular/forms';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ /*ovo include-amo kako bih mogli pristupiti varijablama iz ove componente u drugim componentima */
  providedIn: 'root'
})

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  @ViewChild("f") signUpForm?: NgForm; /*local reference zapisan u HTML-u */

  constructor(private data: DataService, private router: Router) { } /*include-anje service za spremanje podataka */

  log: log = { /*log - logiranje */
    email: "",
    lozinka: "",
  }

  sviKorisnici: reg[] = [] /*kreiramo array, tipa registracijsko polje, koja nosi objekte svih korisnika na stranici (ukljucujuci i administratora)
  kasnije to se provjerava da li se navedeni email i lozinka iz forme u aplikaciji poklapa s nekom iz array-a 'sviKorisnici'*/
  emailPostoji: boolean = false;
  lozinkaJeValjana: boolean = false;
  index: number = 0;

  ngOnInit() {
    console.log(this.log.lozinka)
  }


  checkEmailAdress(): boolean { /*metoda za provjeru ispravnosti email adrese */
    let poljeObservable: Observable<reg[]>;

    poljeObservable = this.data.dohvatiKorisnike();

    poljeObservable.subscribe((serverPolje) => {
      this.sviKorisnici = serverPolje;
      for (let i = 0; i < this.sviKorisnici.length; i++) {
        if (this.sviKorisnici[i].email === this.log.email) {
          this.index = i; /*proslljeđivanje trenutacnog index-a za checkPassword() metodu */

          return this.emailPostoji = true;
        }
      }

      return this.emailPostoji = false;
    })
    return this.emailPostoji; //vracamo boolean vrijednost 
  }

  checkPassword(): boolean { /*metoda za provjeru ispravnosti lozinke */
    let poljeObservable: Observable<reg[]>;

    poljeObservable = this.data.dohvatiKorisnike();

    if (this.sviKorisnici[this.index].lozinka === this.log.lozinka) {
      return this.lozinkaJeValjana = true;
    }

    return this.lozinkaJeValjana = false;
  }

  resetForm() { //metoda za resetiranje forme
    this.signUpForm?.reset();
  }

  logiraj() { //metoda koja se poziva na 'prijavi se' button, u istoj pozivamo funckiju za provjeru gmail-a i lozinke

    if (this.checkEmailAdress() && this.checkPassword()) {
      /*ukoliko su obe metode zadovoljene, tada se poziva metoda incijalizirana u data.service.ts ciji je zadatak proslijediti objekt
      treutacno ulogiranog korisnika, a kao argument se u ovom slucaju zadaje array sa i index-om */
      this.resetForm(); /*resetiranje forme nakon uspjesnog unosa */
      swal("Uspješna prijava", "", "success");
      this.data.postaviLogiranKorisnik(this.sviKorisnici[this.index]) //metoda za mjenjanje natpisa kada jos korisnik nije ulogiran
      this.data.setUlogiranKorisnik(true); /*ovo treba biti true, kako bi se korisnik smatrao ulogiranim */
      this.router.navigate([""]) //nakon logiranja redirect-aj na pocetnu stranu
      return true;
    }

    this.data.setUlogiranKorisnik(false); //ukoliko registracija ne uspije vrati false
    return false;
  }
}
