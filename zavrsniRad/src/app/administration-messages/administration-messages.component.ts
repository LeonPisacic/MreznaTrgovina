import { Component, OnInit } from '@angular/core';
import { porukaKorisnika } from '../model';
import { DataService } from '../service/data.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-administration-messages',
  templateUrl: './administration-messages.component.html',
  styleUrls: ['./administration-messages.component.css']
})
export class AdministrationMessagesComponent implements OnInit {

  mergedProizvodi: any[] = [];

  nemaPorukaKorisnika: boolean = false;
  constructor(public data: DataService) { }

  ngOnInit() {
    this.refresh();
    if (this.mergedProizvodi.length === 0) {
      this.nemaPorukaKorisnika = true;
    }
  }

  obrisiPoruku(idx: number) {
    swal({
      title: "Jesi li siguran?",
      text: "Jesi li siguran da želiš izbrisati ovaj proizvod?",
      icon: "warning",
      buttons: ["Odustani", "OK"],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.data.obrisiPorukuKorisnika(idx).subscribe(() => {  //By subscribing to the deleteProizvod method, you are making sure that the HTTP request is actually sent to the server
            this.refresh();
            swal("Proizvod je obrisan!", {
              icon: "success",
            });
          }); /*brisemo proizvod sa nekog index-a (onog odabranog) */
        }
      });
  }

  spremiIndex(index: number) {
    this.data.korisnikPisaoAdminu = true;
    this.data.sendIndex(index);
  }

  refresh() {
    this.data.dohvatiKorisnickeForme().subscribe((korisnickeForme: porukaKorisnika[]) => { //ova linija koda nam omogucuje viditi odmah promjene u mjenjanju proizvoda
      this.mergedProizvodi = [];

      for (let i = 0; i < korisnickeForme.length; i++) {
        this.mergedProizvodi.push({
          ...korisnickeForme[i],
          //vraca kategoriju proizvoda u tablici administratora
        });

      }
      if (this.data.adminKontaktiraoKorisnika) {
        this.mergedProizvodi = this.data.poljePorukaKorisnika;

        this.data.obrisiPorukuKorisnika(this.data.index).subscribe(); //brisanja narudzbe za korisnika kojeg smo konaktirali
        this.data.brojacPorukaAdmin--;
      }

      if (this.mergedProizvodi.length === 0) {
        this.nemaPorukaKorisnika = true;
      }

      this.data.poljePorukaKorisnika = this.mergedProizvodi;
      this.data.adminKontaktiraoKorisnika = false;
    });
  }
}
