import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Country } from '../common/country';
import { map } from 'rxjs/operators';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private http: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.http.get<GetResponseCountry>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(countryCode: string): Observable<State[]> {

    //build search url
    const searchUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;

    return this.http.get<GetResponseStates>(searchUrl).pipe(
      map(response => response._embedded.states)
    )

  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let data: number[] = [];

    //build an array for "Month" downlist list
    //-start at current month and loop untill 12
    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {

    let data: number[] = [];

    //build an array for "Year" downlist list
    //-start at current year and loop for the next 10 years
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let year = startYear; year <= endYear; year++) {
      data.push(year);
    }

    return of(data);
  }
}

interface GetResponseCountry {
  _embedded: {
    countries: Country[]
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[]
  }
}
