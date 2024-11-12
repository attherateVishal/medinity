import { Injectable } from '@angular/core';
// import { Observable } from "rxjs/Rx"

import { MatSnackBar } from '@angular/material/snack-bar';
// import { environment } from './../environments/environment';
import { environment } from './../environments/environment.prod';

// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/firestore";
// import { Subject } from 'rxjs/Subject';
import { take } from 'rxjs/operators';
// import 'rxjs/add/observable/of';
import { Observable,Observer,Subscription } from 'rxjs';


firebase.initializeApp(environment.firebaseConfig);
// const database = firebase.database();
var db = firebase.firestore();

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private snackbar: MatSnackBar) { }
  uploadData:any=[];
  loggedInStatus:boolean=false;

  setUploadData(data){
    this.uploadData = data;
    db.collection("database").doc("data").set({data:this.uploadData}).then(function(docRef) {
    }).catch(function(error) {
      console.error(error);
    });
  }

  getUploadData(){  
    let datareturn;
    return db.collection("database").get();      
  }

  loginApi(userName,password){
    return firebase.auth().signInWithEmailAndPassword(userName, password);
  }

  logoutApi(){
    return firebase.auth().signOut().then((res)=>{
    }).catch((err)=>{
    })
  }

  loginStatus(status){        
    if(status=='loggedIn'){
      this.loggedInStatus = true;
    }else{
      this.loggedInStatus = false;
    }
   }

  getLoginStatus(){
    const myObservables = Observable.create((observer: Observer<string>) => {
    var status:any; 
    firebase.auth().onIdTokenChanged((user)=>{
      if (user) {
      status = user;       
      } else {
        status = false;
      }

      observer.next(status);
    return status;
  })
})
 return myObservables;
    
  }

}
