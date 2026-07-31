import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Projects } from '../../services/projects';
import { ActivatedRoute, RouterLink ,Router } from '@angular/router';
import { Toastr } from '../../../../core/services/toastr';

@Component({
  // imports: [ReactiveFormsModule, RouterLink]ect',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './add-update-project.html',
  styleUrl: './add-update-project.css',
})
export class AddUpdateProject {
  projService = inject(Projects);
  toastrService = inject(Toastr);
  router = inject(Router);
  route = inject(ActivatedRoute);

  errorMsg = signal('');
  project = this.projService.selectedProject();
  projectId = 0;
  isedit = signal(false);


  ngOnInit() {
   this.checkPageName()
  }
  
checkPageName(){
 this.projectId = this.route.snapshot.params['id'];
    if (this.projectId) {
      this.isedit.set(true);
      this.getProjData();
    }
}

  createProj = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^(?=.{3,100}$)[\p{L}\d\s\-_.()&]+$/u),
    ]),
    description: new FormControl('', [Validators.maxLength(500)]),
  });

  addNewProj(data: FormGroup) {
    this.projService.addNew(data.value).subscribe({
      next: (res) => {
        this.toastrService.success('Your project is added successfully', 'top-right');
        console.log(res);
      },
      error: (err) => {
        this.errorMsg = err.error.message;
        this.toastrService.error(err.error.message, 'top-right');
      },
      complete: () => {
        this.createProj.reset();
        this.router.navigateByUrl('/project');
      },
    });
  }

  getProjData() {
    this.createProj.patchValue({
      name: this.project?.name,
      description: this.project?.description,
    });
  }
  updateProj(data: FormGroup) {
    this.projService.updateProject(data.value, this.projectId).subscribe({
      next: (res) => {
        this.toastrService.success('Your project is updated successfully', 'top-right');

        console.log(res);
      },error:(err)=>{
        this.toastrService.error(err.error.message, 'top-right');
      }, complete:() =>{
          this.createProj.reset();
        this.router.navigateByUrl('/project');
      },
    });
  }


  onSubmit(data: FormGroup) {
    if (this.projectId) {
      this.updateProj(data);
    } else {
      this.addNewProj(data);
    }
  }
}
