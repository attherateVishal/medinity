import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataService } from '../../data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable,Observer,Subscription } from 'rxjs';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  constructor(private formBuilder: FormBuilder, private dataService:DataService,private snackbar: MatSnackBar) { }

  searchDocForm:FormGroup;
  submitted:boolean = false;
  logginStatus:boolean = false;
  smallDevice:boolean = false;
  searchResult:any=[{'Private_Or_Public':''}];
  datafound : boolean = false;
  excelData:any=[];
  excelDataPrivate:any=[];
  excelDataPublic:any=[];
  cities:any=[];
  subAreas:any=[];
  specialities:any=[];
  privateList:any=[];
  privateListFull:any=[];
  publicList:any=[];
  publicListFull:any=[];
  customSubscrition: Subscription;
  pageNo = 0;
  totalPage:number;
  listShow:boolean = false;
  callNow : any = "Call Now";
  // myControl = new FormControl;  

  ngOnInit() {
    if(window.innerWidth>=768){
      this.smallDevice = true;
    }
    this.dataService.getUploadData().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {          
          this.excelData =  doc.data().data;
      });
      
      this.excelData.forEach((dataObj)=>{
        dataObj['Address'] = this.trimFnc(dataObj['Address']); 
        dataObj['City'] = this.trimFnc(dataObj['City']); 
        dataObj['Decipline'] = this.trimFnc(dataObj['Decipline']); 
        dataObj['Name'] = this.trimFnc(dataObj['Name']); 
        dataObj['Private_Or_Public'] = this.trimFnc(dataObj['Private_Or_Public']); 
        dataObj['Speciality'] = this.trimFnc(dataObj['Speciality']); 
        dataObj['Sub_Area'] = this.trimFnc(dataObj['Sub_Area']); 
        dataObj['Telephone_number'] = this.trimFnc(dataObj['Telephone_number']); 
        dataObj['View_Picture_permission'] = this.trimFnc(dataObj['View_Picture_permission']); 
        dataObj['picture_url'] = this.trimFnc(dataObj['picture_url']); 
      })
    });    
    this.searchDocForm = this.formBuilder.group({
      city: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/), Validators.maxLength(80)]],      
      subArea: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/), Validators.maxLength(80)]],      
      speciality: ['', [Validators.required, Validators.maxLength(80)]]      
    });   

  }

  trimFnc(data){    
    if(data!=undefined){
      return data.trim();
    }else{
      return "";
    }    
  }

  get f() { return this.searchDocForm.controls; }


  // set uploaded data if excel file is uploaded.
  setUploadedData(data){
    this.excelData = data;
    this.cities = [];
    this.subAreas = [];
    this.specialities = [];
    this.valueSelect();
  }

  onSubmit(){
    this.listShow = true;
    this.submitted=true;
    this.searchResult = [];
    this.privateList = [];
    this.publicList = [];
    this.privateListFull = [];
    this.publicListFull = [];
    this.pageNo = 0;
    let searchFormValue = this.searchDocForm.value;    
    let uploadedData:any = this.excelData;
    
    if(this.searchDocForm.value['city'].length==0){
      return;
    }else{
      for(let i=0; i<uploadedData.length;i++)
      {
        if(uploadedData[i].hasOwnProperty('City')&&uploadedData[i].hasOwnProperty('Speciality')&&uploadedData[i].hasOwnProperty('Sub_Area')){
          if(searchFormValue.subArea.length==0&&searchFormValue.speciality.length==0?(searchFormValue.city.toLowerCase()==uploadedData[i].City.toLowerCase()):false){
            this.searchResult.push(uploadedData[i]);
          }else if(searchFormValue.subArea.length==0?(searchFormValue.city.toLowerCase()==uploadedData[i].City.toLowerCase())&&(uploadedData[i].Speciality.toLowerCase().includes(searchFormValue.speciality.toLowerCase())):false){
            this.searchResult.push(uploadedData[i]);
          }else if((searchFormValue.city.toLowerCase()==uploadedData[i].City.toLowerCase())&&(uploadedData[i].Speciality.toLowerCase().includes(searchFormValue.speciality.toLowerCase()))&&(searchFormValue.subArea.toLowerCase()==uploadedData[i]['Sub_Area'].toLowerCase()))
          {        
            this.searchResult.push(uploadedData[i]);
          }else{
            
          }
      }else{
        console.log("key not found  in the form selection");
      }
    }

    if(this.searchResult.length>0){
      this.searchResult.forEach((data)=>{
        if(data.Private_Or_Public=="Private"){
          this.privateListFull.push(data);
        }else{
          this.publicListFull.push(data);
        }
      })
    }

    if(this.publicListFull.length>this.privateListFull.length){
      this.totalPage = Math.ceil(this.publicListFull.length/5);
    }else{
      this.totalPage = Math.ceil(this.privateListFull.length/5);
    }
    this.nextFnc(this.pageNo);

    if(this.searchResult.length==0){
      this.snackbar.open("No Record Found", '', {
        duration: 3000, verticalPosition: 'top', panelClass: "success-dialog"
      });
      this.datafound = false;
    }else{
      this.datafound = true;
    }
  }
  }
  valueSelect(){
      this.cities.length=0;
      this.excelData.forEach((data)=>{
        if(this.cities.indexOf(data['City'])==-1&&data.hasOwnProperty("City")){
          if(data.City!==undefined){
            if(data.City.length>0){
            this.cities.push(data['City']);
          }
        }
      }
        if(this.subAreas.indexOf(data['Sub_Area'])==-1&&data.hasOwnProperty("Sub_Area")){
            
          if(data['Sub_Area']!==undefined){  
            if(data['Sub_Area'].length>0){ 
              this.subAreas.push(data['Sub_Area']);
            }
          }
        }  
        if(this.specialities.indexOf(data['Speciality'])==-1&&data.hasOwnProperty("Speciality")){
          if(data["Speciality"]!==undefined){
            if(data["Speciality"].length>0){
            this.specialities.push(data['Speciality']);
            }
          }
        }
      })   
  }

  resetObj(){
    this.privateList=[];
    this.publicList = [];
    this.searchResult = [];
    this.searchDocForm.reset();
    this.datafound = false;
    this.listShow = false;
  }

  nextFnc(pageNo){
    this.pageNo++;
    pageNo = this.pageNo;
    this.privateList = [];
    this.publicList = [];
    let start;
    if(pageNo>1){
     start = ((pageNo-1)*5)-1;
    }else{
      start = 0;
    } 
    let end = (pageNo*5)-1; 
    for(let i=start;i<end;i++){
      if(this.privateListFull[i]){
        this.privateList.push(this.privateListFull[i]);
      }
      if(this.publicListFull[i]){
        this.publicList.push(this.publicListFull[i]);
      }  
    }
  }
  previousFnc(pageNo){
    this.pageNo--;
    pageNo = this.pageNo;
    this.privateList = [];
    this.publicList = [];
    let start;
    if(pageNo>1){
      start = ((pageNo-1)*5)-1;
    }else{
      start = 0;
    }
    let end = (pageNo*5)-1;
    for(let i=start;i<end;i++){
      if(this.privateListFull[i]){
        this.privateList.push(this.privateListFull[i]);
      }
      if(this.publicListFull[i]){
        this.publicList.push(this.publicListFull[i]);
      } 
    }
    
  }
  callNowFnc(data){
    this.callNow = data.Telephone_number;
  }
  
}
