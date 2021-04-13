import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Student } from '../modeles/student';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  student : Student;

  constructor(private auth: AuthService, 
              private http: HttpClient, 
              private router: Router) { }

  ngOnInit() {
    this.student = new Student();
  }

  
  login() {
    this.auth.login(this.student)
  }
}
