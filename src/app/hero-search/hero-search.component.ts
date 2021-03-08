import { Component, OnInit } from '@angular/core';
import {Observable, Subject} from 'rxjs'
import {switchMap, debounceTime, distinctUntilChanged} from 'rxjs/operators'

import {Hero} from '../hero'
import {HeroService} from '../hero.service'

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {

  heroes$: Observable<Hero[]>

  private searchItems = new Subject<string>()

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.heroes$ = this.searchItems.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(name => this.heroService.searchHero(name))
    )
  }

  search(name: string) {
    this.searchItems.next(name)
  }
}
