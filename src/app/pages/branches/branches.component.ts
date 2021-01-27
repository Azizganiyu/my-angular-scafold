import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BranchService } from 'src/app/services/branch/branch.service';
import { HelperService } from 'src/app/services/helper/helper.service';
import { LocationService } from 'src/app/services/location/location.service';
import {MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit {

  loading: boolean = true

  @ViewChild('branchCreateModal', { static: true }) branchCreateModal;
  @ViewChild('branchEditModal', { static: true }) branchEditModal;

  displayedColumns: string[] = ['select', 'name', 'state', 'lga', 'members', 'date_created', 'action'];
  dataSource = new MatTableDataSource([{}]);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  selection = new SelectionModel(true, []);

  updatingId: number

  submit : boolean = false
  branchForm = this.fb.group({
    name: ['', [Validators.required]],
    state: [null, [Validators.required]],
    city: [null],
    lga: [null],
    address: [''],
  })

  states: any = []
  lgas: any = []
  cities: any = []

  loadingLGAS: boolean = false
  loadingCities: boolean = false
  loadingStates: boolean = false

  constructor(
    public helper: HelperService,
    private fb: FormBuilder,
    private location: LocationService,
    private branch: BranchService
  ) {
    this.getStates()
    this.getBranches()
  }

  ngOnInit(): void {
    this.branchForm.get('state').valueChanges.subscribe((val) => {
      this.getLGAS(val)
      this.getCities(val)
      this.branchForm.get('lga').reset()
      this.branchForm.get('city').reset()
    })
  }

  getBranches(){
    this.branch.getBranches().subscribe((data) => {
      console.log(data.data)
      this.dataSource = new MatTableDataSource(data.data)
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
    this.branch.create(this.branchForm.value).subscribe((data) => {
      this.getBranches()
      this.submit = false
      this.hideModal()
      this.helper.showSuccess(data.message, 'Operation Successfull')
     }, (error)=> {
       this.submit = false;
     })
  }

  hideModal(){
    this.branchCreateModal.hide()
    this.branchEditModal.hide()
    this.branchForm.reset()
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
    let confirm = this.helper.confirm('Are you sure you want to Delete this branch? you will lose all its members')
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

      this.branch.delete(null, ids).subscribe((data) => {
        this.helper.showSuccess(data.message, 'Success!')
        this.getBranches()
      }, (error => {
        this.helper.showError(error, 'Error!')
      }))

      this.selection.clear()
    }
    else{
      this.branch.delete(id, null).subscribe((data) => {
        this.helper.showSuccess(data.message, 'Success!')
        this.getBranches()
      }, (error => {
        this.helper.showError(error, 'Error!')
      }))
    }
  }

  edit(element){
    this.updatingId = element.id
    this.branchEditModal.show()
    this.branchForm.patchValue({
      name: element.name,
      state: element.state,
      city: element.city,
      lga: element.lga,
      address: element.address,
    })
    this.getLGAS(element.state)
    this.getCities(element.state)
  }

  update(){
    this.submit = true
    this.branch.update(this.branchForm.value, this.updatingId).subscribe((data) => {
      this.getBranches()
      this.submit = false
      this.hideModal()
      this.helper.showSuccess(data.message, 'Operation Successfull')
     }, (error)=> {
       this.submit = false;
     })
  }

}
