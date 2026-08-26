import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Projects } from '../../services/projects';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { Toastr } from '../../../../shared/components/success-toastr/service/toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  // imports: [ReactiveFormsModule, RouterLink]ect',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-update-project.html',
  styleUrl: './add-update-project.css',
})
export class AddUpdateProject {
  
  errorMsg = signal('');
  projectId = 0;
  isedit = signal(false);
  projService = inject(Projects);
  toastrService = inject(Toastr);
  router = inject(Router);
  route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  project = this.projService.selectedProject;

 

  ngOnInit() {
    this.checkPageName();
      
    this.getProjData()
 
  }

  checkPageName() {
    this.projectId = this.route.snapshot.params['id'];
    
    if (this.isEdit()) {
      this.isedit.set(true);
    }else{
        this.project.set(null)
    }
  }

  isEdit(){
    return this.router.url.includes('/edit')
  }

  createProj = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^(?=.{3,100}$)[\p{L}\d\s\-_.()&]+$/u),
    ]),
    description: new FormControl('', [Validators.maxLength(500)]),
  },{validators: this.checkTitleSpace}
);

  
checkTitleSpace(control: AbstractControl){
const name=control.get('name')?.value;

  return name?.startsWith(' ')?{startsWithSpace:true} :null
  
}

  addNewProj(data: FormGroup) {
    this.projService
      .addNew(data.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastrService.success('Your project is added successfully', 'top-right');
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
    const project=this.project()

    if(project ) {
    
    this.createProj.patchValue({
      name: project.name,
      description: project.description,
    });}else return ;
  }

  
  updateProj(data: FormGroup) {
    this.projService
      .updateProject(data.value, this.projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          
          this.toastrService.success('Your project is updated successfully', 'top-right');
        },
        error: (err) => {
          this.toastrService.error(err.error.message, 'top-right');
        },
        complete: () => {
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
