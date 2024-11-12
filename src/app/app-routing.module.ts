import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//components
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PageNotFoundComponent }from './components/page-not-found/page-not-found.component';
// import { BlogComponent } from './components/blog/blog.component';

const routes: Routes = [{ path: '', redirectTo: 'home', pathMatch: 'full' 
},{
  path:'login',component:LoginComponent
},{
  path:'home',component:DashboardComponent
}
// ,{
//   path:'profile',component:ProfileComponent
// },{
//   path:'blog',component:BlogComponent
// }
,{ path: 'error', component: PageNotFoundComponent }
,{
  path:'**', redirectTo: 'error',pathMatch:'full'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
