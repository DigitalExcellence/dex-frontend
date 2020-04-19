import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-auth-callback",
  templateUrl: "./auth-callback.component.html",
  styleUrls: ["./auth-callback.component.css"],
})
export class AuthCallbackComponent implements OnInit {
  public error: boolean;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // check for error
    if (this.route.snapshot.fragment.indexOf("error") >= 0) {
      this.error = true;
      return;
    }

    this.authService.completeAuthentication();
    this.router.navigate(["/home"]);
  }
}
