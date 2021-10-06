import { Component, OnInit } from '@angular/core';
import { finalize, take } from 'rxjs/operators';
import { User } from 'src/app/models/domain/user';
import { UserService } from 'src/app/services/user.service';

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
