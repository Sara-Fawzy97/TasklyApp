export type ToastType = 'success' | 'error'
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';
export interface IToastr{
  message: string;
  type: ToastType;
  duration?: number;
   position?: ToastPosition;
}