import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface Person {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class SelectDataService {

  // tslint:disable-next-line:variable-name
  private _numbers = [
    100,
    1000,
    10000,
    100000,
    1000000
  ];
  // tslint:disable-next-line:variable-name
  private _people = [
    {
      id: '5a15b13c36e7a7f00cf0d7cb',
      name: 'black'
    },
    {
      id: '5a15b13c2340978ec3d2c0ea',
      name: 'with glasses'
    },
    {
      id: '5a15b13c663ea0af9ad0dae8',
      name: 'male'
    },
    {
      id: '5a15b13cc9eeb36511d65acf',
      name: 'female'
    },
    {
      id: '5a15b13c728cd3f43cc0fe8a',
      name: 'white'
    },
    {
      id: '5a15b13ca51b0aaf8a99c05a',
      name: 'short hair'
    },
    {
      id: '5a15b13ca51b0aaf8a99c05a',
      name: 'long hair'
    }
  ];

  constructor(private http: HttpClient) { }

  getPeople(term: string = null): Observable<Person[]> {
    let items = this.people;
    if (term) {
      items = items.filter(x => x.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
    }
    return of(items).pipe(delay(500));
  }
  getNumbers(term: number = null): Observable<number[]> {
    let items = this.numbers;
    if (term) {
      items = items.filter(x => x === term);
    }
    return of(items).pipe(delay(500));
  }

  // tslint:disable-next-line:typedef
  public get people() {
    return this._people;
  }
  // tslint:disable-next-line:typedef
  public get numbers() {
    return this._numbers;
  }

}

