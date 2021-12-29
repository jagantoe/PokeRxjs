import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, mergeMap, share } from 'rxjs/operators';
import { Pokemon } from '../interfaces/pokemon';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getPokemon(pokemon: string | number = 1): Observable<Pokemon> {
    return this.http.get("https://pokeapi.co/api/v2/pokemon/" + pokemon) as Observable<Pokemon>;
  }

  getMultiplePokemon(limit: number = 20, offset: number = 0): Observable<Pokemon[]> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
      .pipe(
        map((x: any) => x.results.map((y: any) => y.url)),
        mergeMap((urls: Array<string>) => {
          return forkJoin(urls.map((url: string) => this.http.get(url) as Observable<Pokemon>))
        })
      );
  }
}
