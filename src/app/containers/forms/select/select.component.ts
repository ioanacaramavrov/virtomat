import { Component, OnInit } from '@angular/core';
import { SelectDataService, Person } from './select.data.service';
import {Router} from '@angular/router';
import {concat, Observable, of, Subject} from 'rxjs';
import {catchError, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html'
})

export class SelectComponent implements  OnInit {
  people: Person[];
  numbers: number[];
  selectedPeople = [{name: 'black'}];
  selectedNumber = 1000;

  peopleLoading = false;

  peopleAsyncSearch: Observable<Person[]>;
  peopleLoadingAsyncSearch = false;
  peopleInputAsyncSearch = new Subject<string>();

  constructor(private selectDataService: SelectDataService, private router: Router) {
    this.people = selectDataService.people;
    this.numbers = selectDataService.numbers;
    this.router = router;
  }

  trackByFn(item: Person): string {
    return item.id;
  }

  ngOnInit(): void {
    this.peopleLoading = true;
    this.selectDataService.getPeople().subscribe(x => {
      this.people = x;
      this.peopleLoading = false;
    });

    this.peopleAsyncSearch = concat(
      of([]), // default items
      this.peopleInputAsyncSearch.pipe(
        distinctUntilChanged(),
        tap(() => this.peopleLoadingAsyncSearch = true),
        switchMap(term => this.selectDataService.getPeople(term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.peopleLoadingAsyncSearch = false)
        ))
      )
    );
  }

  // tslint:disable-next-line:typedef
  btnClick = function() {
    this.router.navigate(['user/login']);
  };

}
