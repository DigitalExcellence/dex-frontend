import { finalize, take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/domain/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user: User;
  public userLoading = true;


  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService
      .getCurrentUser()
      .pipe(
        take(1),
        finalize(() => {
          this.userLoading = false;
        }))
      .subscribe(result => {
        this.user = result;
      });
  }

}
