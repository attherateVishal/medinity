import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private dataService:DataService,private snackbar: MatSnackBar,
    private router:Router) { }

  loginForm:FormGroup;
  submitted:boolean=false;

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z@. ]+$/), Validators.maxLength(80)]],      
      password: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/), Validators.maxLength(80)]]      
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit(){
    this.submitted=true;
    if(this.loginForm.invalid){
      return;
    }else{
      this.dataService.loginApi(this.loginForm.controls.userName.value,this.loginForm.controls.password.value).then((res)=>{
        this.dataService.loginStatus('loggedIn');
        this.router.navigate(['/home']);
      },(err)=>{        
        this.snackbar.open(err.message, '', {
          duration: 3000, verticalPosition: 'top', panelClass: "success-dialog"
        });
      });     
    }
  }

  

}
