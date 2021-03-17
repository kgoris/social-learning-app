import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Student } from '../modeles/student';
import { WelcomeService } from './welcome.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['welcome.component.css'],
  providers : [WelcomeService]
})
export class WelcomeComponent  implements OnInit{

  public students: Student[];
  constructor(
    private welcomeService:WelcomeService,
    private menu : MenuController) {
  }

  openMenu(){
    console.log("clicked");
    this.menu.enable(true, "first");
    this.menu.open("first");
  }

  closeMenu(){
    this.menu.close('first');
  }
  ngOnInit(): void {
    this.welcomeService.getWelcomeMessage().subscribe(
      val => this.students = val
    )
  }

}
