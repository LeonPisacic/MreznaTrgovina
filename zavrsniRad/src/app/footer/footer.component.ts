import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public navbar: NavbarComponent, public dataService: DataService) { }

  jeAdmin: boolean = false;
  jeUlogiran: boolean = false;

  ngOnInit() {

    this.dataService.logiranKorisnikChange.subscribe((resp) => {

      if (resp.roll === "admin") {
        this.jeAdmin = true
      }
      else {
        this.jeAdmin = false;
      }
    });

    this.dataService.ulogiranKorisnikChange.subscribe((resp) => {

      this.jeUlogiran = resp;
    });
  }

  postaviVrijednost() {
    this.dataService.korisnikPisaoAdminu = false;
  }
}
