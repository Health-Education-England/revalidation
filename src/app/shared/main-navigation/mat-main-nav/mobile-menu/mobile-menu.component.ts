import { Component, OnInit } from "@angular/core";
import { menuItems } from "../menu-items.const";
import { IMenuItem } from "../menu-item.interface";
import { environment } from "@environment";

@Component({
  selector: "app-mobile-menu",
  templateUrl: "./mobile-menu.component.html",
  styleUrls: ["./mobile-menu.component.scss"]
})
export class MobileMenuComponent implements OnInit {
  menuItems$: IMenuItem[] = menuItems;
  hostURI: string = environment.adminsUIHostUri;
  constructor() {}

  ngOnInit(): void {}
}
