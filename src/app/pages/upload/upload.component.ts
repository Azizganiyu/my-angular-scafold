import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/services/helper/helper.service';
import { MemberService } from 'src/app/services/member/member.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  arrayBuffer: any;
  file: File;
  excel_data:any;
  upload_list;
  uploaded_list:any;
  failed_list:any;
  total_upload:number;
  number_of_successful_uploads: number = 0;
  number_of_failed_uploads: number = 0;
  upload_pending: boolean = false;
  upload_loader: boolean;// = false;
  show_table: boolean = false;
  vendor;
  user;
  error_msg: string;
  success_msg: string;
  constructor(private helper: HelperService, private manageMemberService: MemberService) {
    this.vendor = this.helper.getVendor();
    this.user = this.helper.getUser();
  }

  ngOnInit() {
    this.uploaded_list = [];
    this.failed_list = [];
  }

  on_file_change(event) {
    var reader = new FileReader();
  }

  incomingfile(event) {
    this.file = event.target.files[0];
    if(this.file){
      this.upload_list = [];
      this.show_table = false;
      this.number_of_failed_uploads = 0;
      this.number_of_successful_uploads = 0;
    }
  }

  Upload() {
    this.upload_pending = true;
    let fileReader = new FileReader();
    fileReader.onload = (e) => {

      this.arrayBuffer = fileReader.result;

      this.save(fileReader.result);
    }
    // fileReader.readAsArrayBuffer(this.file);
    fileReader.readAsDataURL(this.file);
  }
  isInArray(value, array) {
    return array.indexOf(value) > -1;
  }

  private prepareSave(file): any {
    console.log(file);
    let input = new FormData();
    input.append('file', file);
    input.append('vendor_id', this.vendor.id);
    input.append('approved_by', this.helper.getUser().id);
    input.append('user_id', this.helper.getUser().user_id);
    input.append('branch_id', this.helper.getBranch().id);
    return input;
  }

  save(file) {
    this.upload_loader = true;
    let confirm = this.helper.confirm('Are You Sure You want to Upload all this Member?')
    confirm.afterClosed().subscribe(result => {
      if(result){
        this.success_msg ="please wait while processing data (uploading). please ensure the last data has been uploaded";
        let data = this.prepareSave(file);
        this.manageMemberService.uploadCoopMembers(data).subscribe((response) => {
          if (response.success) {
            this.helper.showSuccess(response.message, 'Operation Successfull');
            this.upload_pending = false;
            this.success_msg = response.message;
            this.excel_data = response.errors;
            this.number_of_failed_uploads = response.errors.length;
            this.number_of_successful_uploads = response.total - this.number_of_failed_uploads;
            this.total_upload = response.total;

            if (this.excel_data !== false) {
              this.show_table = true;
            }
          }
          else {
            this.helper.showError(response.message, 'Operation Unsuccessfull');
            this.upload_pending = false;
            this.success_msg = response.message;
          }
        }, (error) => {
        })

        this.upload_loader= false;
      }
    });
  }
  percentageCalculator(value, total)
  {
    let percentage = 0;
    percentage = (value/total) * 100;
    return Math.round(percentage)
  }
  view_result(data)
  {
    this.upload_loader = true;
    this.upload_list = data
    this.upload_loader = false;

  }

}
