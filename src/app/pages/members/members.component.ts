import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MemberService } from 'src/app/services/member/member.service';
import { HelperService } from 'src/app/services/helper/helper.service';
import { LocationService } from 'src/app/services/location/location.service';
import {MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { BranchService } from 'src/app/services/branch/branch.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  memberView: any
  showing: string
  loading: boolean = true

  @ViewChild('memberCreateModal', { static: true }) memberCreateModal;
  @ViewChild('memberEditModal', { static: true }) memberEditModal;
  @ViewChild('memberViewModal', { static: true }) memberViewModal;

  displayedColumns: string[] = ['select', 'name', 'account_number', 'state', 'branch', 'status', 'date_created', 'action'];
  dataSource = new MatTableDataSource([{}]);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  selection = new SelectionModel(true, []);

  updatingId: number

  submit : boolean = false
  memberForm = this.fb.group({
    first_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    branch_id: [null, [Validators.required]],
    middle_name: [''],
    ippis: [''],
    date_of_birth: [''],
    gender: ['male', [Validators.required]],
    phone: ['',],
    email: ['', [Validators.email]],
    state: [null, [Validators.required]],
    city: [null],
    lga: [null, [Validators.required]],
    address: [''],
    account_number: ['', [Validators.required]],
    membership_date: [''],
  })

  states: any = []
  lgas: any = []
  cities: any = []
  branches: any = []

  loadingLGAS: boolean = false
  loadingCities: boolean = false
  loadingStates: boolean = false

  constructor(
    public helper: HelperService,
    private fb: FormBuilder,
    private location: LocationService,
    private member: MemberService,
    private branch: BranchService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((param) => {
      if(param.branch){
        this.getMemberByBranch(param.branch)
        this.showing = "Loading..."
      }
      else{
        this.getMembers()
        this.showing = 'All'
      }
    })
    this.getStates()
    this.getBranches()
  }

  ngOnInit(): void {
    this.memberForm.get('state').valueChanges.subscribe((val) => {
      this.getLGAS(val)
      this.getCities(val)
      this.memberForm.get('lga').reset()
      this.memberForm.get('city').reset()
    })
  }

  getBranches(){
    this.branch.getBranches().subscribe((data) => {
      this.branches = data.data
    });
  }

  getMembers(){
    this.member.getMembers().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data.data.data)
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.loading = false
    }, (error => {
      this.loading = false
    }));
  }

  getStates(){
    this.loadingStates = true
    this.location.getStates().subscribe(data => {
      this.states = data
      this.loadingStates = false
    })
  }

  getMemberByBranch(id){
    this.member.getMembersByBranch(id).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.data)
      setTimeout(() => this.dataSource.paginator = this.paginator);
      this.loading = false
      this.showing = data.branch_name+' Members'
    }, (error => {
      this.loading = false
    }));
  }

  getLGAS(state){
    this.loadingLGAS = true
    this.location.getLGAS(state).subscribe(data => {
      if(data.status != 404){
        this.lgas = data
      }
      else{
        this.lgas = []
      }
      this.loadingLGAS = false
    })
  }

  getCities(state){
    this.loadingCities = true
    this.location.getCities(state).subscribe(data => {
      if(data.status != 404){
        this.cities = data
      }
      else{
        this.cities = []
      }
      this.loadingCities = false
    })
  }

  create(){
    this.submit = true
    this.member.create(this.memberForm.value).subscribe((data) => {
      this.getMembers()
      this.submit = false
      this.hideModal()
      this.helper.showSuccess(data.message, 'Operation Successfull')
     }, (error)=> {
       this.submit = false;
     })
  }

  hideModal(){
    this.memberCreateModal.hide()
    this.memberEditModal.hide()
    this.memberViewModal.hide()
    this.memberForm.reset()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  confirmDelete(id){
    this.hideModal()
    let confirm = this.helper.confirm('Are you sure you want to Delete this member? you will lose all its members')
    confirm.afterClosed().subscribe(result => {
      if(result){
        this.deleteSelected(id)
      }
    });
  }

  deleteSelected(id){
    if(id == null){
      let ids = []
      this.selection.selected.forEach((data) => {
        ids.push(data.id)
      });

      this.member.delete(null, ids).subscribe((data) => {
        this.helper.showSuccess(data.message, 'Success!')
        this.getMembers()
      }, (error => {
        this.helper.showError(error, 'Error!')
      }))

      this.selection.clear()
    }
    else{
      this.member.delete(id, null).subscribe((data) => {
        this.helper.showSuccess(data.message, 'Success!')
        this.getMembers()
      }, (error => {
        this.helper.showError(error, 'Error!')
      }))
    }
  }

  edit(element){
    this.updatingId = element.id
    this.memberEditModal.show()
    this.memberForm.patchValue({
      first_name: element.first_name,
      last_name: element.last_name,
      branch_id: element.branch_id,
      middle_name: element.middle_name,
      ippis: element.ippis,
      date_of_birth: element.date_of_birth,
      gender: element.gender,
      phone: element.phone,
      email: element.email,
      state: element.state,
      city: element.city,
      lga: element.lga,
      address: element.address,
      account_number: element.account_number,
      membership_date: element.membership_date,
    })
    this.getLGAS(element.state)
    this.getCities(element.state)
  }

  update(){
    this.submit = true
    this.member.update(this.memberForm.value, this.updatingId).subscribe((data) => {
      this.getMembers()
      this.submit = false
      this.hideModal()
      this.helper.showSuccess(data.message, 'Operation Successfull')
     }, (error)=> {
       this.submit = false;
     })
  }

  view(element){
    this.memberView = element
    this.memberViewModal.show()
  }


}
