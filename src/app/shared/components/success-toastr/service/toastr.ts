import { Injectable, signal } from '@angular/core';
import { IToastr } from '../Itoast.model';
@Injectable({
  providedIn: 'root',
})
export class Toastr {
  toast = signal<IToastr | null>(null);

  show(options: IToastr) {

    this.toast.set({
      position: 'top-right',
      duration: 3000,
      ...options,
    });

    setTimeout(() => {
      this.hide();
    }, this.toast()?.duration);
  }

  success(message: string, position?: IToastr['position']) {
    this.show({
      message,
      type: 'success',
      position,
    });
  }

  error(message: string, position?: IToastr['position']) {
    this.show({
      message,
      type: 'error',
      position,
    });
  }

  hide() {
    this.toast.set(null);
  }
}
