import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { porukaKorisnika } from '../model';
import { DataService } from '../service/data.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-kontakt-forma',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class KontaktFormaComponent {

  constructor(private router: Router, public data: DataService) { }

  @ViewChild("f") signUpForm?: NgForm;

  trenutnaPoruka: porukaKorisnika = {
    ime: "",
    email: "",
    porukaKorisnika: ""
  }

  submitForme() {

    this.data.posaljiKorisnikovuFormu(this.trenutnaPoruka).subscribe();
    this.router.navigate(["/"])
    swal("Forma uspješno poslana!", "", "success");
  }

  resetForm() {
    this.signUpForm?.reset();
  }
}