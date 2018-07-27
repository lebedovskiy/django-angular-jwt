import {Component, OnInit} from '@angular/core';
import {User} from '../user';
import {UserService} from '../user.service';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {JwtHelperService} from '@auth0/angular-jwt';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentUser: User;
  editProfileForm: FormGroup;
  loading = false;
  submitted = false;
  files: File;

  helper = new JwtHelperService();

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private router: Router,
  ) {
    this.currentUser = this.helper.decodeToken(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.getUser(this.currentUser.user_id);
    console.log(this.currentUser.user_id);
    this.editProfileForm = this.formBuilder.group({
      email: [this.currentUser.email,
        Validators.pattern("[a-zA-Z_0-9]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}")
      ],
      password: [this.currentUser.password, [
        Validators.required,
        Validators.minLength(6)
      ]],
      first_name: [this.currentUser.first_name],
      middle_name: [this.currentUser.middle_name],
      last_name: [this.currentUser.last_name],
      phone: null,
      avatar: [],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    console.log(this.currentUser);
    let final_data;
    if (this.files) {
      let file: File = this.files;
      const formData = new FormData();
      formData.append('avatar', file);
      final_data = this.getFormData()
    }
    else {
      final_data = this.getFormData();
    }
    this.userService.update(this.currentUser.id, final_data)
      .subscribe(
        final_data => {
          this.router.navigate(['/home']);
        },
        error => {
          this.loading = false;
          console.log(error)
        });
  }

  addAvatar(event) {
    let target = event.target || event.srcElement;
    this.files = target.files;
    if (this.files) {
      let files: File = this.files;
      const formData = new FormData();
        formData.append('avatar', files);
    }
  }

  getFormData() {
      const formData = new FormData();
      formData.append('email', this.editProfileForm.value.email);
      formData.append('password', this.editProfileForm.value.password);
      formData.append('password', this.editProfileForm.value.password);
      formData.append('first_name', this.editProfileForm.value.first_name);
      formData.append('middle_name', this.editProfileForm.value.middle_name);
      formData.append('last_name', this.editProfileForm.value.last_name);
      formData.append('phone', this.editProfileForm.value.phone);
      return formData;
    };

  getUser(id: number) {
    return this.userService.getById(id).subscribe((data: User) => this.currentUser = data)
  }
}
