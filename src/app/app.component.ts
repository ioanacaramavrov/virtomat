import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { LangService } from './shared/lang.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

@Injectable()
export class AppComponent implements OnInit, AfterViewInit {
  isMultiColorActive = environment.isMultiColorActive;
  constructor(private router: Router, private langService: LangService, private renderer: Renderer2) {

  }

  ngOnInit(): void {
    this.langService.init();
    // this.router.navigate(['app']);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderer.addClass(document.body, 'show');
    }, 1000);
    setTimeout(() => {
      this.renderer.addClass(document.body, 'default-transition');
    }, 1500);
  }
}
