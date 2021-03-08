import { NgModule } from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import {APP_BASE_HREF} from '@angular/common'

import {HerosComponent} from './heros/heros.component'
import {DashboardComponent} from './dashboard/dashboard.component'
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'heroes', component: HerosComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'detail/:id', component: HeroDetailComponent}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  // @ts-ignore
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: (window as any)?.__POWERED_BY_QIANKUN__ ? '/app-angular': '/',
    }
  ]
})

export class AppRoutingModule { }
