import { Component, Injectable, ViewChild } from '@angular/core';
import { reg } from '../model'; /*include-anje naseg interface-a */
import { NgForm } from '@angular/forms';
import { DataService } from '../service/data.service';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})
@Component({
  selector: 'app-registracija',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistracijaComponent {

  @ViewChild("f") signUpForm?: NgForm; /*local reference zapisan u HTML-u */

  constructor(private dataService: DataService, private router: Router) { } /*include-anje service za spremanje podataka */

  reg: reg = { /*prazan objekt tipa 'reg' interface kojeg punimo sa */
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

  polje: reg[] = [] /*kreirani array tipa registracijski interface kojeg punimo sa podacima preko two way binding-a u html 
  prilikom ispunjavanja registracijske forme*/
  emailPostoji: boolean = false; /*boolean vrijednost putem koje provjeravamo postoji li navedeni email koji zelimo upisati u formu
  vec kod nekog korisnika (ne smije postojati jer je email jedistvena vrijednost svakog korisnika i ne smije se ponavljati) */
  index: number = 0;


  checkEmailAdress(): boolean {
    let poljeObservable: Observable<reg[]>

    poljeObservable = this.dataService.dohvatiKorisnike();

    poljeObservable.subscribe((serverPolje) => {
      this.polje = serverPolje;

      for (let i = 0; i < this.polje.length; i++) {
        if (this.polje[i] && this.polje[i].email === this.reg.email) {
          this.index = i;
          return this.emailPostoji = true; // ako postoji vraćamo true
        }
      }
      return this.emailPostoji = false;
    })
    return this.emailPostoji;
  }

  checkPassword(): boolean {
    const symbolRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    if (this.reg.lozinka.length < 5 || !symbolRegex.test(this.reg.lozinka)) {
      return false;
    }

    return true;
  }


  //metoda za restiranje registracijske forme nakon uspjesno kreiranog/registriranog novog korisnika
  resetForm() {
    this.signUpForm?.reset();
  }


  registriraj() { //upis podataka u polje

    this.checkEmailAdress();   //pozivanje funckije za provjeru valjanosti email adrese

    if (!this.emailPostoji) {
      this.dataService.dodajKorisnika(this.reg).subscribe();
    }

    this.router.navigate([""]);
    swal("Uspješno kreiran korisnički račun!", "Veselimo se tvojim budućim narudžbama :)", "success");
  }

}

