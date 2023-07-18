import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainPageComponent } from './all-products/all-products.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { RegistracijaComponent } from './registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OpisProizvodaComponent } from './product-info/product-info.component';
import { ReklameComponent } from './adds/adds.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { KosaricaComponent } from './shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AdministracijaComponent } from './administration/administration.component';
import { EditProizvodaComponent } from './administration/edit-product/edit-product.component';
import { PregledNarudzbiComponent } from './view-orders/view-orders.component';
import { KontaktInfoComponent } from './contact-info/contact-info.component';
import { FiltriranjeKategorijaComponent } from './filtering-category/filtering-category.component';
import { PocetnaComponent } from './main-page/main-page.component';
import { KontaktFormaComponent } from './contact-form/contact-form.component';
import { AllOrdersAdministrationComponent } from './all-orders-administration/all-orders-administration.component';
import { AdministrationMessagesComponent } from './administration-messages/administration-messages.component';
import { AdminContactUserComponent } from './admin-contact-user/admin-contact-user.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainPageComponent,
    FooterComponent,
    LoginComponent,
    RegistracijaComponent,
    OpisProizvodaComponent,
    ReklameComponent,
    KosaricaComponent,
    CheckoutComponent,
    AdministracijaComponent,
    EditProizvodaComponent,
    PregledNarudzbiComponent,
    KontaktInfoComponent,
    FiltriranjeKategorijaComponent,
    PocetnaComponent,
    KontaktFormaComponent,
    AllOrdersAdministrationComponent,
    AdministrationMessagesComponent,

    AdminContactUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    HttpClientModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
