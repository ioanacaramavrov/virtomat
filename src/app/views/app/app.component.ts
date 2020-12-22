import { Component,Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidebarService, ISidebar } from 'src/app/containers/layout/sidebar/sidebar.service';
import { Router } from '@angular/router';
import { ChartService } from '../../components/charts/chart.service';
import {
  conversionChartData
} from '../../data/charts';
@Component({
  selector: 'app-app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  sidebar: ISidebar;
  subscription: Subscription;
  @Input() control = true;
  chartDataConfig: ChartService;

  conversionChartData = conversionChartData;

  constructor(private chartService: ChartService, private router: Router, private sidebarService: SidebarService) {
    this.chartDataConfig = this.chartService;

  }
  btnClick= function () {
    this.router.navigate(['user/login']);
      }
  ngOnInit(): void {
    this.subscription = this.sidebarService.getSidebar().subscribe(
      res => {
        this.sidebar = res;
      },
      err => {
        console.error(`An error occurred: ${err.message}`);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
