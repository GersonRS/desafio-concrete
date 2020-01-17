import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userName = "";

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSubmit(f: NgForm){
    let route = "/search/"+f.value['userName'];
    this.router.navigate([route]);
  }

}
