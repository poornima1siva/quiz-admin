import { Routes } from '@angular/router';
import { CreateaccountComponent } from './createaccount/createaccount.component';
import { AddquizComponent } from './addquiz/addquiz.component';
import { AddquestionComponent } from './addquestion/addquestion.component';
import { DisplayquizComponent } from './displayquiz/displayquiz.component';
import { AlterquizComponent } from './alterquiz/alterquiz.component';
import { LoginComponent } from './login/login.component';
import { DeletequizComponent } from './deletequiz/deletequiz.component';
import { AlterquestionComponent } from './alterquestion/alterquestion.component';

export const routes: Routes = [

    {
        path:'createaccount', component:CreateaccountComponent
    },
    {
        path:'addquiz', component:AddquizComponent
    },
    {
        path: 'addquestion/:id',
        loadComponent: () => import('./addquestion/addquestion.component').then(m => m.AddquestionComponent)
      },
      
    {
        path:'displayquiz', component:DisplayquizComponent
    },

    {
        path:'alterquiz/:id', component:AlterquizComponent
    },
    {
        path:'', component:LoginComponent
    },
    {
        path:'deletequiz' , component:DeletequizComponent
    },
    {
        path:'alterquestion/:questionId' , component:AlterquestionComponent
    }

];
