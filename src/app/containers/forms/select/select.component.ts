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
  selectedPeople: Person[] = [{name: 'black', id: '5a15b13c36e7a7f00cf0d7cb'}];
  selectedNumber = 1000;
  isUnique: boolean;
  peopleLoading = false;
  price = 2010;

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
  updatePrice(): void {
    this.price = 2 * this.selectedNumber + this.selectedPeople.length * 10;
    if (this.isUnique) {
      this.price = this.price * 10;
    }
  }

  handleUnique(evt: any): void {
    const target = evt.target;
    if (target.checked) {
      this.isUnique = true;
    }
    this.updatePrice();
  }

  handleNonUnique(evt: any): void {
    const target = evt.target;
    if (target.checked) {
      this.isUnique = false;
    }
    this.updatePrice();
  }

  btnClick = function(): void {
    this.router.navigate(['user/login']);
  };


  handleFeatures(evt: any): void {
    this.updatePrice();
  }

  handleSelectedNumber(evt: any): void {
    this.updatePrice();
  }
}
