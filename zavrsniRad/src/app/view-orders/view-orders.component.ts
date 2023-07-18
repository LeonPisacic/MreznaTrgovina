import { Component, Injectable, OnInit } from '@angular/core';
import { NarudzbaSve, reg } from '../model';
import { DataService } from '../service/data.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import { Observable, Subscription } from 'rxjs';
import swal from 'sweetalert';
import 'jspdf-autotable';


@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-pregled-narudzbi',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class PregledNarudzbiComponent implements OnInit {

  /*prazan objekt tipa interface 'naruzdbaSve' u kojeg zapisujemo podatke o logiranom korisniku, korisniku preko kojeg 
  kupujemo u formi i popis proizvoda koje je kupac kupio */
  pregledNarudzbi: NarudzbaSve[] = [];
  narudzbaZaOdredenuOsobu: Subscription = new Subscription();

  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;

  imaNarudzbi: boolean = false;
  adminUlogiran: boolean = false;
  sviKorisnici: reg[] = [];


  // prazni objekt tipa reg interface, koji nam sluzi kako bi u njega mogli puniti podatke o trenutnom logiranom korisniku
  ulogiraniKorisnik: reg = {
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

  constructor(public data: DataService) { }

  calculateTotals(NarudzbaSve: NarudzbaSve[], idx: number) { //metoda za izracunavanje subtotal,total i tax koja se poziva za svaku narudzbu
    const totals = []; //array u kojeg punimo rezultate subtotal,total i tax vrijednosti

    let SUBTOTAL = 0;
    let tax = 0;
    let total = 0;

    for (let proizvod of NarudzbaSve) { //for let loop koji nam sluzi da odvojimo jedan od argumenata (interface-a)
      let proizvodi = proizvod.proizvodi; // uzimamo vrijednost proizvodi (interface kosarica[]) iz kojeg uzimamo potrebne podatke za izracunavanje
      //subtotal-a, tax i total vrijednosti
      SUBTOTAL = 0;
      tax = 0;
      total = 0;

      for (let jedanProizvod of proizvodi) {
        SUBTOTAL += jedanProizvod.kolicina * jedanProizvod.cijena;
      }
      tax = SUBTOTAL * 0.25;
      total = SUBTOTAL + tax;
      totals.push({ SUBTOTAL, tax, total })

      /*dodjeljivanje vrijednosti globalnim varijablama koje koristimo prilikom ispisa racuna */
      this.subtotal = SUBTOTAL;
      this.tax = tax;
      this.total = total;
    }
    return totals[idx];
  }

  ngOnInit() {
    this.data.dohvatiNarudzbe().subscribe((data) => {
      this.data.narudzbaSve = data;

    });

    this.refresh();

    // pretplacujemo se na sve promjene subject-a odabraniKorisnikNarudzbaChange - koji prati narudzbe za svakog pojedinog korisnika
    this.narudzbaZaOdredenuOsobu = this.data.odabraniKorisnikNaruduzbaChange.subscribe(
      {
        next: (resp) => {
          this.data.dohvatiNarudzbe().subscribe((data) => {

            this.pregledNarudzbi = data;
            let rez: NarudzbaSve[];
            this.ulogiraniKorisnik = resp;

            if (this.ulogiraniKorisnik.roll === 'admin') {
              this.adminUlogiran = true;
            }

            rez = this.pregledNarudzbi.filter((obj) => { /*filtirramo narudzbe prema email-u. Zato sto je email adresa jedinstvena 
            i taj način prikazujemo samo narudzbe za pojedinog korisnika, a ne i narudzbe drugih korisnika*/
              return obj.korisnik.email === this.ulogiraniKorisnik.email; //vracamo vrijednost mail-a
            })
            this.pregledNarudzbi = rez; //dodijeljujemo vrijednost filtiranih narudzbi varijabli pregledNarudzbi

            if (this.pregledNarudzbi.length > 0) {
              this.imaNarudzbi = true;
            }
          });
        }
      });
    this.ulogiraniKorisnik = this.data.dohvatiKorisnika(); //dohvacamo logiranog korisnika, bez ovoga nam neće prikazivati nase narudzbe
  }

  //metoda za dizajn pdf-a, nacinjena prema jsPDF library-u
  preuzmiRacun(id: number) {

    // Create a new jsPDF instance
    let doc = new jsPDF();
    const customFont = ('../../assets/fonts/AbhayaLibre-Medium.ttf');

    doc.addFileToVFS('customFont.ttf', customFont);
    doc.addFont('customFont.ttf', 'custom', 'normal');

    doc.setFont('custom');

    const header = function () {
      // Set the font size and style for the header
      doc.setFontSize(12);
      doc.setFont('bold');

      // Add the LP webshop logo
      const imgData = 'assets/slike/logo.png';
      doc.addImage(imgData, 'PNG', 60, 20, 30, 30);

      const companyName = "LP webshop";
      const companyAddress = "Heinzlova ulica 44, 1000 Zagreb";
      const companyCountry = "Croatia";
      const phone = "Phone: +385 1 123 4567";
      const email = "Email: info@lpwebshop.com";

      const textWidth = doc.getTextWidth(companyName);
      const centerPosition = (doc.internal.pageSize.width / 2) - (textWidth / 2);

      doc.text(companyName, centerPosition, 20);
      doc.text(companyAddress, centerPosition, 28);
      doc.text(companyCountry, centerPosition, 36);

      // Add the contact information
      doc.setFontSize(10);
      doc.setFont('normal');
      doc.text(phone, centerPosition, 44);
      doc.text(email, centerPosition, 52);
    };


    const footer = () => {
      doc.setFontSize(10);

      doc.setFont('Georgia')
      // Define table columns and rows for subtotal, tax, and total
      doc.setFillColor(245, 245, 245); // Adding light grey background-color
      doc.rect(0, doc.internal.pageSize.height - 50, doc.internal.pageSize.width, 50, "F");

      // Set footer text style
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFillColor(255, 255, 255); // Adding white background-color

      var startY = doc.internal.pageSize.height - 70; // Set the starting y-position for the text

      doc.rect(0, startY - 5, doc.internal.pageSize.width, 35, "F");
      doc.setFontSize(10);
      doc.setFillColor(0, 0, 0); // Set font color

      var subtotalY = startY - 10;
      var taxY = startY;
      var totalY = startY + 10;


      doc.text("Subtotal", 100, subtotalY);
      doc.text("$" + this.subtotal.toFixed(2), 180, subtotalY);
      doc.text("Tax", 100, taxY);
      doc.text("$" + this.tax.toFixed(2), 180, taxY);
      doc.text("Total", 100, totalY);
      doc.text("$" + this.total.toFixed(2), 180, totalY);


      // Add "Thank you for your order" text
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);

      const thankYouText = "Thank you for your order!";
      const thankYouTextWidth = doc.getTextDimensions(thankYouText).w;
      const thankYouTextX = (doc.internal.pageSize.width - thankYouTextWidth) / 2;
      const thankYouTextY = doc.internal.pageSize.height - 35

      doc.text(thankYouText, thankYouTextX, thankYouTextY);

      // Add contact email address
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      const text = "In case of any issues, please contact us at leon.pisacic2002@gmail.com";
      const textWidth = doc.getTextDimensions(text).w;
      const textX = (doc.internal.pageSize.width - textWidth) / 2;
      const textY = doc.internal.pageSize.height - 25;

      doc.text(text, textX, textY);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      const lpWebshopX = 20;
      // LP Webshop
      doc.text("LP Webshop", lpWebshopX, doc.internal.pageSize.height - 10);

      const fbLogo = 'assets/slike/Facebook_logo_(square).png';
      const fbIconX = 10;
      const fbIconY = doc.internal.pageSize.height - 14;
      const fbIconWidth = 5;
      const fbIconHeight = 5;
      doc.addImage(fbLogo, 'PNG', fbIconX, fbIconY, fbIconWidth, fbIconHeight);

      const lpWebshopX2 = 90;
      doc.text("LP_Webshop", lpWebshopX2, doc.internal.pageSize.height - 10);
      // Instagram logo aligned center
      const igLogo = "assets/slike/Instagram_logo.png"
      const igLogoX = doc.internal.pageSize.width / 2 + 8.5;
      const igLogoY = doc.internal.pageSize.height - 14;
      const igLogoWidth = 5;
      const igLogoHeight = 5;
      doc.addImage(igLogo, 'PNG', igLogoX, igLogoY, igLogoWidth, igLogoHeight);


      // Twitter logo aligned right
      const lpWebshopX3 = 170;
      doc.text("Lp_webshop", lpWebshopX3, doc.internal.pageSize.height - 10);
      const twLogo = 'assets/slike/Twitter_logo.png'
      const twLogoX = doc.internal.pageSize.width - 15;
      const twLogoY = doc.internal.pageSize.height - 14;
      const twLogoWidth = 5;
      const twLogoHeight = 5;

      doc.addImage(twLogo, 'PNG', twLogoX, twLogoY, twLogoWidth, twLogoHeight);
    };

    const options = {
      beforePageContent: header,
      afterPageContent: footer
    };

    autoTable(doc, { html: '#tabNarudzba_' + id, startY: 80, ...options });
    autoTable(doc, { html: '#tabProizvod_' + id, startY: 110, ...options });

    // Save PDF file
    doc.save('Narudzba.pdf');
  }

  refresh() {

    let korisniciObservable: Observable<reg[]>;

    korisniciObservable = this.data.dohvatiKorisnike();

    this.data.dohvatiKorisnike().subscribe(() => { //ova linija koda nam omogucuje viditi odmah promjene u mjenjanju proizvoda
      korisniciObservable.subscribe((korisnici: reg[]) => {

        this.sviKorisnici = [];
        for (let i = 0; i < korisnici.length; i++) {

          this.sviKorisnici.push({
            ...korisnici[i],
          });
        }

      });
    })
  }


  obrisi(idx: number) {

    swal({
      title: "Jesi li siguran?",
      text: "Jesi li siguran da želiš izbrisati ovog korisnika?",
      icon: "warning",
      buttons: ["Odustani", "OK"],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.data.obrisiKorisnika(idx).subscribe(() => { //By subscribing to the deleteProizvod method, you are making sure that the HTTP request is actually sent to the server

            this.refresh(); /*odmah nakon brisanja pozivamo refresh() metodu koja djeluje odmah (odmah refresh-a stranicu i vide se promjene) */
            //u suprotnom da nemamo pozivanje ove funckije, promjene bi bile tek vidljive kada bi otisli na drugu i vratili se na ovu str.

            swal("Korisnik je upješno obrisan!", {
              icon: "success",
            });
          }); /*brisemo proizvod sa nekog index-a (onog odabranog) */
        }
      });
  }


}