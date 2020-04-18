import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { Highlight } from "src/app/models/domain/hightlight";
import { HighlightService } from "src/app/services/highlight.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
