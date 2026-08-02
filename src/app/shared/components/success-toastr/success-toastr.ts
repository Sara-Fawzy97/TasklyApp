import { Component, inject } from '@angular/core';
import { Toastr } from'./service/toastr';

@Component({
  selector: 'app-success-toastr',
  imports: [],
  templateUrl: './success-toastr.html',
  styleUrl: './success-toastr.css',
})
export class SuccessToastr {

    toastrService = inject(Toastr);
}
