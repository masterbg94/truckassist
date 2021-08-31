import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-user-verify-component',
  templateUrl: './user-verify.component.html',
  styleUrls: ['./user-verify.component.scss']
})
export class UserVerifyComponent implements OnInit {
  showError: any;
  showLoader: boolean;

  constructor(private activatedRoute: ActivatedRoute, private auth: AuthenticationService, private router: Router) {
  }

  ngOnInit(): void {
    this.showLoader = true;
    this.activatedRoute.params.subscribe((r) => {
      console.log(r);
      this.checkUserVerification(r.hashedUsername, r.code);
    });
  }

  /**
   * test if user have password if dont than redirect it to set password
   */
  checkUserVerification(hash, code) {
    this.auth.checkVerification(hash, code).subscribe(
      (resp: any) => {
        localStorage.clear();
        localStorage.setItem('token', JSON.stringify(resp.token));
        const id = resp.loggedUser.userObject.id;
        // ako ima password samo redirekt na activated
        if (resp.loggedUser.userObject.password != null) {
          this.router.navigate(['/register/activated']);
        } else {
          // ako nema password / treba dodati id & token zbog redirekcije
          // token = resp.loggedUser.userObject.token
          // id = resp.loggedUser.userObject.id
          this.router.navigate([`/user/set/password/start/${hash}/${id}`]);
        }
      }, (error) => {
        this.showError = error;
        this.showLoader = false;
      }
    );
  }
}
