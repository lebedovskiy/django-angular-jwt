import {Component, OnInit} from '@angular/core';
import {User} from '../user';
import {UserService} from '../user.service';
import {Router} from "@angular/router";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import {JwtHelperService} from '@auth0/angular-jwt';


import {UploadService} from "../upload.service";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentUser: User;
  public user: User;
  editProfileForm: FormGroup;
  avatarForm: FormGroup;
  loading = false;
  submitted = false;

  helper = new JwtHelperService();

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private router: Router,
              private uploadService: UploadService,
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
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      first_name: [''],
      middle_name: [''],
      last_name: [''],
      phones: new FormArray([
        new FormControl('+7',)
      ]),
    });
    this.avatarForm = this.formBuilder.group({
      avatar: [''],
    })
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    console.log(this.currentUser);
    this.userService.update(this.currentUser.id, this.editProfileForm.value)
      .subscribe(
        data => {
          this.router.navigate(['/login']);
        },
        error => {
          this.loading = false;
          console.log(error)
        });
  }

  changeAvatar() {
      this.uploadService.uploadFile('http://127.0.0.1:8000/user/1', this.avatarForm.value)
  }

  addPhone() {
    (<FormArray>this.editProfileForm.controls["phones"]).push(new FormControl("+7", Validators.required));
  }

  getUser(id: number) {
    return this.userService.getById(id).subscribe((data: User) => this.currentUser = data)
  }

  deleteUser(id: number) {
    this.userService.delete(id)
  }

}
