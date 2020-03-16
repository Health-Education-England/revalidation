import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "@environment";
import { NgxsModule } from "@ngxs/store";
import { AnalyticsModule, HotJarModule } from "hee-shared";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { HttpClientModule } from "@angular/common/http";
import { MaterialModule } from "./shared/material/material.module";
import { MainNavigationModule } from "./shared/main-navigation/main-navigation.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    SharedModule,
    AppRoutingModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    }),
    AnalyticsModule.forRoot({
      siteId: ["UA-40570867-6"],
      enabled: environment.production
    }),
    HotJarModule.forRoot({
      hotJarId: 1662399,
      hotJarSv: 6,
      enabled: environment.production
    }),
    NgxsModule.forRoot([], { developmentMode: !environment.production }),
    MainNavigationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
