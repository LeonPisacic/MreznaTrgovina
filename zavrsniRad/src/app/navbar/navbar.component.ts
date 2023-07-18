import { Component, Injectable, OnInit } from '@angular/core';
import { kategorijaProizvoda, reg } from '../model';
import { DataService } from '../service/data.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
@Injectable({ /*ovo mora tu biti */
  providedIn: 'root'
})

export class NavbarComponent implements OnInit { /*komponenta koja prima subscription */

  poljeKategorija: kategorijaProizvoda[] = [];
  jeUlogiran: boolean = false;
  jeAdmin: boolean = false;

  logiranKorisnik: reg = { /*prazan objekt tipa interface 'reg' kojeg punimo sa sadrzajem trenutnog korisnika */
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
  };


  subs: Subscription = new Subscription()
  status: Subscription = new Subscription();

  constructor(public dataService: DataService, private router: Router) {
    this.dataService.dohvatiKategorijeProizvoda().subscribe((poljeKategorija) => {
      this.poljeKategorija = poljeKategorija;
    });
  }

  ngOnInit(): any {
    if (this.logiranKorisnik)
      this.subs = this.dataService.logiranKorisnikChange.subscribe(
        /*pretplacujemo se na promjene , uzimamo subject (logiranKorisnikChange) te ga pretplacujmo na sve buduce promjene*/
        {
          next: (resp) => {
            this.logiranKorisnik = resp; /*zapisujemo objekt trenutnog u lokalni objekt tipa 'reg' (koji je u pocetku prazan),  a to radimo kako bi 
          na kraju krajeva mogli ispisati ime potrebno za ispisivanje teksta 'Pozdrav Leon' (ime je proizvoljno i ovisi o trenutacnom korisniku) */

            if (this.logiranKorisnik.roll === "admin") {
              this.jeAdmin = true
            }
            else {
              this.jeAdmin = false;
            }
          }
        }
      )

    this.status = this.dataService.ulogiranKorisnikChange.subscribe(
      /*pretplacujemo se na promjene uzimamo subject /ulogiranKorisnikChange) te ga pretplacujemo na sve buduce promjene */
      {
        next: (resp) => {
          this.jeUlogiran = resp; /*pretplacujemo se na promjenu varijable boolean tipa, koju koristimo kako bi mogli hide-ati 
          gumbove registracija/login, odnosno 'Pozdrav Leon' i 'odjavi se' gumb  */
          this.dataService.jeUlogiran = resp;
        }
      }
    )
  }

  ngOnDestroy() { /*prekidamo preplatu, da se nebi trosili nepotrebni resursi i tako usporavali stranicu */
    this.subs.unsubscribe();
    this.status.unsubscribe();
  }

  odjava() {

    swal({
      title: "Jesi li siguran?",
      text: "Jesi li siguran da se želiš odjaviti?",
      icon: "warning",
      buttons: ["Odustani", "OK"],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          swal("Uspješno ste se odjavili", "", "success");
          this.dataService.resetLogiranKorisnik(); /*praznimo objekt tipa 'reg' iz data.service-a */
          this.jeUlogiran = false;
          this.dataService.jeUlogiran = false;
          this.dataService.setUlogiranKorisnik(false);
          this.dataService.isprazniKosaricu(); /*false oznacuje izlaz iz logiranog nacina, odnosno odjava */
          this.dataService.brojacKosarica = 0; //nakon odjave postavimo span na nulu jer postaje prazna kosarica
          this.router.navigate([""])
        }
      });
  }

  filtrirajKategoriju(id: number) {
    this.dataService.setKategorijaProizvoda(id);
  }

  trenutnaKategorija(kategorija: kategorijaProizvoda) { /*funckija koju pozivamo u HTML-U na click neke kategorije, tad spremamo tu vrijednost
    (kategorija) u metodu vratiTrenutnuKategorijuProizvoda, kojom kasnije sukladno sa 
    kategorijom ispisujemo naziv kategorije na filtiranoj novoj stranici (<h3>)*/
    this.dataService.dohvatiTrenutnuKategorijuProizvoda(kategorija); //metoda zasluzna za vracanje objekta kliknute kategorije (kod pop out menia)
  }
}
