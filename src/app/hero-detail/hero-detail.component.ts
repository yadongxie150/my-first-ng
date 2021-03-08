import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'

import {Hero} from '../hero'
import {HeroService} from '../hero.service'

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})
export class HeroDetailComponent implements OnInit {
  hero:Hero

  constructor(
    private route: ActivatedRoute, // 依赖注入
    private heroService: HeroService,
    private location: Location
  ) { }
  
  ngOnInit(): void {
    this.getHeroById()
  }

  getHeroById(): void {
    const id = +this.route.snapshot.paramMap.get('id')
    this.heroService.getHeroById(id).subscribe(hero => {
      this.hero = hero
    })
  }

  goback(): void{
    this.location.back()
  }

  save(): void {
    this.heroService.updateHero(this.hero).subscribe(() => this.goback())
  }
}
