import { Injectable, signal } from '@angular/core';
import { IToastr } from '../../shared/components/success-toastr/Itoast.model';
@Injectable({
  providedIn: 'root',
})
export class Toastr {

toast = signal<IToastr | null>(null);

   show(options: IToastr) {
 console.log(options);
 
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
    position
  });
}

  //  success(
  //   message: string,
  //   position?: IToastr['position']
  // ) {
  //   this.show({
  //     message,
  //     type: 'success',
  //     position
  //   });
  // }


  // success(message: string) {
  //   this.type.set('success');
  //   this.message.set(message);
  //   this.show.set(true);

  //   setTimeout(() => {
  //     this.show.set(false);
  //   }, 3000);
  // }


   error(
    message: string,
    position?: IToastr['position']
  ) {
    this.show({
      message,
      type: 'error',
      position,
    });
  }
  // error(message: string) {
  //   this.type.set('error');
  //   this.message.set(message);
  //   this.show.set(true);

  //   setTimeout(() => {
  //     this.show.set(false);
  //   }, 3000);
  // }

   hide() {
    this.toast.set(null);
  }
}
