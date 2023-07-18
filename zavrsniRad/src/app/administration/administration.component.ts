import { Component, Injectable, OnInit } from '@angular/core';
import { kategorijaProizvoda, proizvodi } from '../model';
import { DataService } from '../service/data.service';
import swal from 'sweetalert';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-administracija',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})

@Injectable({
  providedIn: "root"
})
export class AdministracijaComponent implements OnInit {
  poljeKategorija: kategorijaProizvoda[] = [];
  proizvodi: proizvodi[] = [];
  mergedProizvodi: any[] = []; /*array u kojeg spajamo atribute iz interface-a 'proizvodi' i 'kosarica'  */
  mergedProizvodiCopy: any[] = []; /*kopija orginalnog array-a 'mergedProizvodi' */
  search: string = ""; /*varijabla tipa 'string' koju koristimo za implementiranje search button-a */


  constructor(private data: DataService) {
    this.data.dohvatiKategorijeProizvoda().subscribe((poljeKategorija) => {
      this.poljeKategorija = poljeKategorija;
    });
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    let proizvodiObservable: Observable<proizvodi[]>;

    proizvodiObservable = this.data.dohvatiProizvode();

    this.data.dohvatiProizvode().subscribe(() => { //ova linija koda nam omogucuje viditi odmah promjene u mjenjanju proizvoda
      proizvodiObservable.subscribe((proizvodi: proizvodi[]) => {

        this.mergedProizvodi = [];
        for (let i = 0; i < proizvodi.length; i++) {
          proizvodi[i].kategorijaID = +proizvodi[i].kategorijaID; //da mi pretvara postavku kategorijaID u broj
          this.mergedProizvodi.push({
            ...proizvodi[i],
            ...(this.poljeKategorija.find((obj) => obj.id === proizvodi[i].kategorijaID))
            //vraca kategoriju proizvoda u tablici administratora
          });
        }
        this.mergedProizvodiCopy = this.mergedProizvodi.slice();

      });
    })
  }

  obrisi(idx: number) { //metoda za brisanje proizvoda u admin nacinu rada, sa font awesome upozorenjima

    /*sweet alert pop out sreen-ovi */
    swal({
      title: "Jesi li siguran?",
      text: "Jesi li siguran da želiš izbrisati ovaj proizvod?",
      icon: "warning",
      buttons: ["Odustani", "OK"],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.data.obrisiProizvod(idx).subscribe(() => { //By subscribing to the deleteProizvod method, you are making sure that the HTTP request is actually sent to the server
            this.refresh(); /*odmah nakon brisanja pozivamo refresh() metodu koja djeluje odmah (odmah refresh-a stranicu i vide se promjene) */
            //u suprotnom da nemamo pozivanje ove funckije, promjene bi bile tek vidljive kada bi otisli na drugu i vratili se na ovu str.
            swal("Proizvod je obrisan!", {
              icon: "success",
            });
          });
        }
      });
  }

  sendIndex(index: number) { //metoda za slanje trenutno kliknutog indexa proizvoda, a to koristimo u opis-proizvoda.component
    this.data.index = index;
  }

  uredi(id: number) { //metoda za uredivanje vec postojeceg proizvoda
    this.data.setTrenutniIndexProizvoda(id); //set-iramo trenutni index Proizvoda kojeg smo kliknuli
    this.data.setEditProizvod(true); //postavljamo boolean vrijednost ne 'true' koje u prijevodu znaci 'izmjeni vec postojeci proizvod'
  }

  novi() { //metoda za dodavanje novog proizvoda
    this.data.setEditProizvod(false); //postavljamo boolean vrijednost ne 'false' koje u prijevodu znaci 'dodaj potpuno novi proizvod'
  }

  //metoda koja omogucuje funckionalnost search bar-a u admin nacinu
  searchFunction() {
    let search = this.search.toLowerCase(); //deklariramo varijablu u koju zapisujemo promjenu slovo po slovo

    if (this.search) {
      this.mergedProizvodi = this.mergedProizvodiCopy.filter((obj) => { /* */
        /*odredujemo paramtetre po kojima ce search raditi */
        return (obj.kratakOpisProizvoda.toLowerCase() + obj.opis.toLowerCase() + obj.naziv.toLowerCase()).includes(search);
        /*filtriramo search po podudaranju po opisu, po nazivu proizvoda i po kategoriji proizvoda. Sve pisemo u lowercase kako bih 
        izbjegli nepodudaranja zbog case sensitive-a */
      })
    }
  }
}

