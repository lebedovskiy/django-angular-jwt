import {Component, OnInit} from '@angular/core';

import {User} from '../user';
import {Token} from "../token";

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

  token: Token;
  user: User;
  editProfileForm: FormGroup;
  loading = false;
  submitted = false;
  files: FileList;

  helper = new JwtHelperService();

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private router: Router,
  ) {
    // декодим токен чтобы получить данные юзера
    this.token = this.helper.decodeToken(localStorage.getItem('token'));
    // парсим пэйлоад респонса сервера
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    console.log(this.token);
    // получаем пользователя по его ID из токена
    this.getUser(this.token.user_id);
    // строим форму
    this.editProfileForm = this.formBuilder.group({
      email: [this.user.email,
        Validators.pattern("[a-zA-Z_0-9]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}")
      ],
      password: [this.user.password, [
        Validators.required,
        Validators.minLength(6)
      ]],
      first_name: [this.user.first_name],
      middle_name: [this.user.middle_name],
      last_name: [this.user.last_name],
      phone: [this.user.phone],
      avatar: [],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    let final_data;
    // получаем данные для отправки на сервер
    final_data = this.getFormData();
    this.userService.update(this.token.user_id, final_data)
      .subscribe(
        final_data => {
          this.router.navigate(['/home']);
        },
        error => {
          this.loading = false;
          console.log(error)
        });
    // перезагружаем страницу чтобы получить новые данные юзера
    location.reload()
  }

  addAvatar(event) {
    let target = event.target || event.srcElement;
    this.files = target.files;
    if (this.files) {
      let files: FileList = this.files;
      const formData = new FormData();
      formData.append('avatar', files[0]);
    }
  }

  getFormData() {
    // получаем данные из формы в FormData
    const formData = new FormData();
    if (this.files) {
      // проверяем изменение аватара
      let files: FileList = this.files;
      formData.append('avatar', files[0]);
    }
    // добавляем остальные данные из формы
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
    // получаем юзера по ID, записываем в this.user чтобы обращаться из HTML.
    return this.userService.getById(id).subscribe((data: User) => this.user = data)
  }
}
