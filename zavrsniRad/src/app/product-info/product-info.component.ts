import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { proizvodi } from '../model';
import swal from 'sweetalert';
import { MainPageComponent } from '../all-products/all-products.component';
import { FiltriranjeKategorijaComponent } from '../filtering-category/filtering-category.component';


@Component({
  selector: 'app-opis-proizvoda',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.css']
})
export class OpisProizvodaComponent implements OnInit {

  index: number = 0;
  nemaViseProizvoda: boolean = false;
  objektProizvodi: proizvodi = { /*prazan objekt tipa interface 'proizvodi' kojeg punimo sa podacima o proizvodu na kojeg kliknemo */
    ukupno: 0,
    kolicina: 0,
    sifra: 0,
    imeProizvoda: "",
    kratakOpisProizvoda: "",
    slika: "",
    cijena: 0,
    respolozivo: 0,
    opis: "",
    kategorijaID: 0
  };

  constructor(public data: DataService) { }

  ngOnInit() {
    this.objektProizvodi = this.data.vratiTrenutnoOdabraniProizvod();

    if (this.objektProizvodi.respolozivo === 0) {
      this.nemaViseProizvoda = true;
    }

    this.data.dohvatiProizvode().subscribe((data) => { //dohvacanje indexa proizovda kako bih isti mogli dodati u kosaricu
      for (let i = 0; i < data.length; i++) {
        if (data[i].sifra === this.objektProizvodi.sifra) {
          this.index = i;
        }
      }
    })
  }

  nemaKolicine() {
    swal({
      content: {
        element: "span",
        attributes: {
          innerHTML: "<i class='fa-regular fa-face-frown' style='font-size: 30px'></i>"
        }
      },

      text: "Nažalost, ovaj proizvod više nije količinski dostupan",
      icon: "error",
    });
  }

}
