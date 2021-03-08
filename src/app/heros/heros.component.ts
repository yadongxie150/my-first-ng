import { Component, OnInit } from '@angular/core';
import {Hero} from '../hero'
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';


@Component({
  selector: 'app-heros',
  templateUrl: './heros.component.html',
  styleUrls: ['./heros.component.scss']
})
export class HerosComponent implements OnInit {
  selectedHero:Hero

  heros: Hero[]

  constructor(private heroService: HeroService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getHeroes()
  }

  getHeroes(): void {
    // Observable
    this.heroService.getHeroes().subscribe(heros => {
      this.heros = heros
    })
  }

  onSelect(hero: Hero) {
    this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`)
    this.selectedHero = hero
  }

  add(name: string){
    name = name.trim()
    if(!name) return
    this.heroService.addHero({name} as Hero).subscribe(hero => {
      this.heros.push(hero)
    })
  }

  delete(hero: Hero):void {
    this.heros = this.heros.filter(item => item !== hero)
    this.heroService.deleteHero(hero).subscribe()
  }

}
