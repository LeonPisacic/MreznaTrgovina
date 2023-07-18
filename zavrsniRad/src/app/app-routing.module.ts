import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './all-products/all-products.component';
import { LoginComponent } from './login/login.component';
import { RegistracijaComponent } from './registration/registration.component';
import { OpisProizvodaComponent } from './product-info/product-info.component';
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
import { IsAuthenthicatedGuard } from './auth.guard';
const routes: Routes = [ /*routing file, zaduzen za redirekciju izmedu više stranica */

  { path: "opis", component: OpisProizvodaComponent },
  { path: "kosarica", component: KosaricaComponent },
  { path: "checkout", component: CheckoutComponent },
  { path: "kontaktInfo", component: KontaktInfoComponent },
  {
    path: "pregledNarudzbi", component: PregledNarudzbiComponent,
    canActivate: [IsAuthenthicatedGuard]
  },
  {
    path: "editProizvoda", component: EditProizvodaComponent,
    canActivate: [IsAuthenthicatedGuard]
  },
  {
    path: "administracija", component: AdministracijaComponent,
    canActivate: [IsAuthenthicatedGuard]
  },
  {
    path: "sveNarudzbeAdmin", component: AllOrdersAdministrationComponent,
    canActivate: [IsAuthenthicatedGuard]
  },
  {
    path: "porukeAdmin", component: AdministrationMessagesComponent,
    canActivate: [IsAuthenthicatedGuard]
  },
  {
    path: "kontaktirajKorisnika", component: AdminContactUserComponent,
    canActivate: [IsAuthenthicatedGuard]
  },
  { path: "login", component: LoginComponent },
  { path: "registracija", component: RegistracijaComponent },
  { path: "kontaktForma", component: KontaktFormaComponent },
  { path: "glavno", component: MainPageComponent },
  { path: ":id", component: FiltriranjeKategorijaComponent },
  { path: "", component: PocetnaComponent }//glavna stranica
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
