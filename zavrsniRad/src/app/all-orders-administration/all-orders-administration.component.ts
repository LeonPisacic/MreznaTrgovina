import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { NarudzbaSve } from '../model';
import swal from 'sweetalert';
import { PregledNarudzbiComponent } from '../view-orders/view-orders.component';

@Component({
  selector: 'app-all-orders-administration',
  templateUrl: './all-orders-administration.component.html',
  styleUrls: ['./all-orders-administration.component.css']
})
export class AllOrdersAdministrationComponent implements OnInit {

  sveNarudzbe: NarudzbaSve[] = [];
  narudzbaPoslana: boolean = false;

  constructor(private data: DataService, public viewOrders: PregledNarudzbiComponent) { }

  ngOnInit() {
    this.refresh();
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

      // Sakrivanje narudžbi koje su poslane (narudzbaObradena === true)
      this.sveNarudzbe = this.sveNarudzbe.filter((narudzba) => !narudzba.narudzbaObradena);
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
          // Sakrivanje narudžbe iz prikaza
          this.sveNarudzbe.splice(idx, 1);
        }
      });
  }
}
