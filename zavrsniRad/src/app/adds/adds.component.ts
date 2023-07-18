import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reklame',
  templateUrl: './adds.component.html',
  styleUrls: ['./adds.component.css']
})
export class ReklameComponent implements OnInit {
  ngOnInit(): void {
    this.showSlides(this.slideIndex = 1);//pozivanje funkcije u ngOnInit-u zato sto se on izvrsava odmah pri load-anju stranice
    this.showSlides2(); //pozivanje funkcije u ngOnInit-u zato sto se on izvrsava odmah pri load-anju stranice
  }

  slideIndex: number = 1;
  showSlides(slideIndex: number): any;

  // Thumbnail image controls

  showSlides(n: number): void {
    let i: number;
    let slides: HTMLCollectionOf<Element> = document.getElementsByClassName("mySlides");
    let dots: HTMLCollectionOf<Element> = document.getElementsByClassName("dot");

    if (n > slides.length) { this.slideIndex = 1 }
    if (n < 1) { this.slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
      (slides[i] as HTMLElement).style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      (dots[i] as HTMLElement).className = (dots[i] as HTMLElement).className.replace(' active', "");
    }
    (slides[this.slideIndex - 1] as HTMLElement).style.display = "block";
    (dots[this.slideIndex - 1] as HTMLElement).className += " active";
  }


  // Next/previous controls
  plusSlides(n: number): any {
    this.showSlides(this.slideIndex += n);
  }
  currentSlide(n: number): void {
    this.showSlides(this.slideIndex = n);
  }

  /* */
  slideIndex2: number = 0;


  showSlides2(): any {
    let i: number;
    let slides: HTMLCollectionOf<Element> = document.getElementsByClassName("mySlides");
    let dots: HTMLCollectionOf<Element> = document.getElementsByClassName("dot");

    for (i = 0; i < slides.length; i++) {
      (slides[i] as HTMLElement).style.display = "none";
    }
    this.slideIndex2++;

    for (i = 0; i < dots.length; i++) {
      (dots[i] as HTMLElement).className = (dots[i] as HTMLElement).className.replace(' active', '');
    }

    setTimeout(() => {
      if (this.slideIndex2 < slides.length) {
        this.showSlides2();
      } else {
        // Restart the slideshow from the beginning
        this.slideIndex2 = 0;
        this.showSlides2();
      }
    }, 2000);

    (slides[this.slideIndex2 - 1] as HTMLElement).style.display = "block";
    (dots[this.slideIndex2 - 1] as HTMLElement).className += " active";
  }
}
