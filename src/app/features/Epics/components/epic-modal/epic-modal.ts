import { Component,  output} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-epic-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './epic-modal.html',
  styleUrl: './epic-modal.css',
})
export class EpicModal {
  today = new Date().toISOString().split('T')[0];

closee = output();

closeModal(){
this.closee.emit();
}


  value = '';
  getInitials(name: string) {
    if (!name) return '';

    const words = name.trim().split('');

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
  }

 EpicForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3), 
      Validators.pattern(/^(?=.{3,100}$)[\p{L}\d\s\-_.()&]+$/u),
    ]),
    description: new FormControl('', [Validators.maxLength(500)]),
    assignee_id: new FormControl(null),
    deadline: new FormControl(null),
  },{validators:this.checkTitleSpace}
);

  checkTitleSpace(control: AbstractControl){
    const name=control.get('title')?.value
    return name.startsWith(' ')?{startsWithSpace:true} :null
 }

}
