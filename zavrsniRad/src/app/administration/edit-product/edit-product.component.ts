import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { kategorijaProizvoda, proizvodi } from 'src/app/model';
import { DataService } from 'src/app/service/data.service';
import swal from 'sweetalert';

@Injectable({
  providedIn: "root"
})

@Component({
  selector: 'app-edit-proizvoda',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})

export class EditProizvodaComponent implements OnInit {

  poljeKategorija: kategorijaProizvoda[] = []; //varijabla kreirana za dohvacanje ime kategorije proizvoda
  @ViewChild("f") addProductForm?: NgForm; /*local reference zapisan u HTML-u */
  index: number = -1;
  sifraVecPostoji: boolean = false;

  trenutnoDodanProizvod: proizvodi = { //objekt kreiran kako bi kasnije mogli u njega upisati proizvod koji treba dohvatiti i uređivati
    imeProizvoda: '',
    kratakOpisProizvoda: '',
    opis: '',
    slika: '',
    cijena: 0,
    respolozivo: 0,
    ukupno: 0,
    kolicina: 0,
    sifra: 0,
    kategorijaID: 0
  };

  constructor(private data: DataService, private router: Router) {
    this.data.dohvatiKategorijeProizvoda().subscribe((poljeKategorija) => {
      this.poljeKategorija = poljeKategorija;
    });
  }

  ngOnInit() {
    if (this.data.dohvatiEditProizvod()) {
      this.data.dohvatiProizvod(this.data.dohvatiTrenutniIndexProizvoda()).subscribe((data) => {
        this.trenutnoDodanProizvod = data;
      });
    }
  }

  resetForm() { /*metoda za resetiranje forme  */
    swal("Proizvod je uspješno uređen!", "Od sada je promjena vidljiva svim korisnicima", "success");
    // this.addProductForm?.reset(); //resetiranje forme, 
    this.router.navigate(["/administracija"]); //nakon uspjesnog uređenog proizvoda presmjerimo ga na administracija stranicu
  }

  submit() {

    if (this.data.dohvatiEditProizvod()) { /*za postojeci proizvod */
      this.data.urediProizvod(this.trenutnoDodanProizvod, this.data.dohvatiTrenutniIndexProizvoda()).subscribe((data) => {
        this.trenutnoDodanProizvod = data;
      });

      this.resetForm();
    }

    else { /*za novi proizvod */
      this.data.postaviDodanNoviProizvod(this.trenutnoDodanProizvod).subscribe((data) => {
        this.trenutnoDodanProizvod = data;
      });

      this.resetForm();
    }
  }

  provjeriSifru(): boolean {

    if (this.data.dohvatiEditProizvod()) {  /*ukoliko je rijec u postojecem proizvodu (edit proizvoda) */
      this.data.dohvatiProizvode().subscribe((data) => {

        for (let i = 0; i < data.length; i++) {

          if (this.trenutnoDodanProizvod.sifra === data[i].sifra && this.data.dohvatiTrenutniIndexProizvoda() !== i) {
            return this.sifraVecPostoji = true;
          }
        }
        return this.sifraVecPostoji = false;

      });
    }

    else { /*ukoliko je rijec u novome proizvodu */
      this.data.dohvatiProizvode().subscribe((data) => {

        for (let i = 0; i < data.length; i++) {

          if (this.trenutnoDodanProizvod.sifra === data[i].sifra) {
            return this.sifraVecPostoji = true;
          }
        }
        return this.sifraVecPostoji = false;
      });
    }

    return this.sifraVecPostoji;
  }

}

