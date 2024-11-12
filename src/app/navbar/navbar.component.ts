import { Component, OnInit,Input } from '@angular/core';
import * as XLSX from 'xlsx';  
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../data.service'; 
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private dataService:DataService, private Router: Router,
    private DashboardComponent : DashboardComponent) { }

  fileReaded:any;
  logginStatus:any;
  customSubscrition: Subscription;
  demo:boolean=false;

  ngOnInit() {

     this.dataService.getLoginStatus().subscribe((res)=>{      
      if(res){
        this.logginStatus = true;
      }else{
        this.logginStatus = false;
      }
    });
    
  }

storeData: any;  
csvData: any;  
jsonData: any;  
textData: any;  
htmlData: any;  
fileUploaded: File;  
worksheet: any;  
fileUpload(event) {  
  this.fileUploaded = event.target.files[0]; 
  if(this.fileUploaded.type=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
    this.readExcel();
  }else{
    this.snackbar.open("Only Excel sheets are allowed", '', {
      duration: 3000, verticalPosition: 'top', panelClass: "success-dialog"
    });
  }
    
}  
readExcel() {  
  let readFile = new FileReader();  
  readFile.onload = (e) => {  
    this.storeData = readFile.result;  
    var data = new Uint8Array(this.storeData);  
    var arr = new Array();  
    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);  
    var bstr = arr.join("");  
    var workbook = XLSX.read(bstr, { type: "binary" });  
    var first_sheet_name = workbook.SheetNames[0];  
    this.worksheet = workbook.Sheets[first_sheet_name];  
    this.readAsJson();
  }  
  readFile.readAsArrayBuffer(this.fileUploaded); 
   
}  
  
readAsJson() {  
  this.jsonData = XLSX.utils.sheet_to_json(this.worksheet, { raw: false });
  this.dataService.setUploadData(this.jsonData);
  this.DashboardComponent.setUploadedData(this.jsonData);
  if(this.jsonData.length>0){
    this.snackbar.open("File uploaded", '', {
      duration: 3000, verticalPosition: 'top', panelClass: "success-dialog"
    });
  }else{
    this.snackbar.open("No data uploaded", '', {
      duration: 3000, verticalPosition: 'top', panelClass: "error-dialog"
    });
  }
}

logoutFnc(){
      this.dataService.logoutApi().then((res)=>{
    }).catch((error)=>{   
  });
  this.logginStatus = false;
}

homeBtnFnc(){
  this.Router.navigate(["/home"]);
  this.DashboardComponent.resetObj();
}
} 

