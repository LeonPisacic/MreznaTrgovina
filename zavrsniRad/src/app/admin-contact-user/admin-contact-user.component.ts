import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { porukaAdministratora, porukaKorisnika } from '../model';
import swal from 'sweetalert';

@Component({
  selector: 'app-admin-contact-user',
  templateUrl: './admin-contact-user.component.html',
  styleUrls: ['./admin-contact-user.component.css']
})
export class AdminContactUserComponent implements OnInit {
  constructor(private router: Router, public data: DataService) { }

  @ViewChild("f") signUpForm?: NgForm;

  trenutnaPoruka: porukaKorisnika = {
    ime: "",
    email: "",
    porukaKorisnika: "",
  }

  porukaZaPoslatiKorisniku: porukaAdministratora = {
    ime: "",
    email: "",
    porukaKorisnika: "",
    porukaZaKorisnika: ""
  }

  ngOnInit() {

    this.data.dohvatiOdabranuPorukuKorisnika(this.data.index).subscribe((data) => {

      if (this.data.korisnikPisaoAdminu) {
        this.trenutnaPoruka = data;
      }
    });
  }

  submitForm() {
    // Create a new instance of porukaAdministratora and assign values from trenutnaPoruka
    const porukaAdministratorData: porukaAdministratora = {
      ime: this.trenutnaPoruka.ime,
      email: this.trenutnaPoruka.email,
      porukaKorisnika: this.trenutnaPoruka.porukaKorisnika,
      porukaZaKorisnika: this.porukaZaPoslatiKorisniku.porukaZaKorisnika // Assign the value for this property
    };

    this.data.posaljiAdminPoruku(porukaAdministratorData).subscribe();
    this.data.poljePorukaKorisnika.splice(this.data.index, 1);

    this.data.adminKontaktiraoKorisnika = true;
    this.router.navigate(["/"]);
    swal("Forma uspješno poslana!", "", "success");
  }

  resetForm() {
    this.signUpForm?.resetForm();
  }

}
