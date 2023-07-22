import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { NarudzbaSve } from '../model';
import swal from 'sweetalert';
import { PregledNarudzbiComponent } from '../view-orders/view-orders.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-orders-administration',
  templateUrl: './all-orders-administration.component.html',
  styleUrls: ['./all-orders-administration.component.css']
})
export class AllOrdersAdministrationComponent implements OnInit {

  sveNarudzbe: NarudzbaSve[] = [];
  vrstaNarudzbeOdabrana: boolean = false;
  prikaziNarudzbu: boolean = false;
  narudzbaUTijeku: boolean = false;

  index: number = 0;
  sifraNarudzbeArray: any[] = [];
  sifraNarudzbeArray2: any[] = [];

  constructor(private data: DataService, public viewOrders: PregledNarudzbiComponent, private router: Router) { }

  ngOnInit() {
    this.refresh();

    this.data.dohvatiNarudzbe().subscribe((data) => {
      for (let i = 0; i < data.length; i++) {
        if (!(data[i].narudzbaObradena)) {
          this.sifraNarudzbeArray2.push((data[i] as any)._id);
        }
        else {
          this.sifraNarudzbeArray.push((data[i] as any)._id);
        }
      }
    });


  }


  sendIndex(idx: number) {
    this.index = idx;

    this.vrstaNarudzbeOdabrana = true;
    this.prikaziNarudzbu = true;

    return this.sveNarudzbe[idx];
  }

  refresh() {
    // Dohvaćanje svih narudžbi
    this.data.dohvatiNarudzbe().subscribe((narudzbe: NarudzbaSve[]) => {
      // Mapiranje i ažuriranje svake narudžbe i pripadajućih proizvoda
      this.sveNarudzbe = narudzbe.map((narudzba) => {
        return {
          ...narudzba,
          proizvodi: narudzba.proizvodi.map((proizvod) => {
            return {
              ...proizvod,
              // Postavljanje statusa narudžbe "narudzbaObradena" za svaki proizvod
              narudzbaObradena: narudzba.narudzbaObradena
            };
          })
        };
      });


    });
  }

  obrisiNarudzbu(idx: number) {
    swal({
      title: "Jesi li siguran?",
      text: "Jesi li siguran da želiš izbrisati ovaj proizvod?",
      icon: "warning",
      buttons: ["Odustani", "OK"],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          // Postavljanje narudzbaObradena na true za označenu narudžbu
          this.sveNarudzbe[idx].narudzbaObradena = true;
          // Osvježavanje podataka na backendu
          swal("Proizvod je obrisan!", {
            icon: "success",
          });
          this.data.promjeniDioNarudzbe(this.sveNarudzbe).subscribe();
          console.log(this.sveNarudzbe[idx])
          this.sifraNarudzbeArray.push((this.sveNarudzbe[idx] as any)._id);

          this.sveNarudzbe.splice(idx, 1);      // Sakrivanje narudžbe iz prikaza
          this.vrstaNarudzbeOdabrana = false;
          this.prikaziNarudzbu = false;
        }
      });
  }

  filtriraj_Narudzbe_Na_Cekanju() {
    this.narudzbaUTijeku = true;

    this.data.dohvatiNarudzbe().subscribe((data) => {
      const filteredData = data.filter((obj) => {
        return obj.narudzbaObradena === false;
      });

      this.sveNarudzbe = filteredData; //dodavanje filtrirane varijable (filteredData) varijabli, odnosno array-u kojeg ispisujemo u HTML-U
    });


    this.vrstaNarudzbeOdabrana = true;
  }

  filtrirajRijeseneNarudzbe() {
    this.narudzbaUTijeku = false;

    this.data.dohvatiNarudzbe().subscribe((data) => {
      const filteredData = data.filter((obj) => {
        return obj.narudzbaObradena === true;
      });

      this.sveNarudzbe = filteredData;
    });

    this.vrstaNarudzbeOdabrana = true;
  }

  vratiKorakNazad() {
    this.vrstaNarudzbeOdabrana = false;
  }

  vratiKorakNazad2() {
    this.vrstaNarudzbeOdabrana = true;
    this.prikaziNarudzbu = false;
  }
}
