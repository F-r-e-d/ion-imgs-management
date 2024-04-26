
import { Directive, ElementRef, HostListener, Input, OnInit, HostBinding } from '@angular/core';



@Directive({ selector: `[delayDrag]` })
export class DelayDragDirective {
  @Input('delayDrag')
  public dragDelay: number | null = null;

  private touchTimeout: any;

  @HostBinding('class.delay-drag-lifted')
  private draggable: boolean = false;

  constructor(private el: ElementRef) {}

  get delay() {
    // if it's a string, that's because we didn't pass a value (<div delayDragLift></div>)
    return (typeof this.dragDelay === 'number')
      ? this.dragDelay
      : 200;
  }

  @HostListener('touchstart', ['$event'])
  private onTouchStart(evt: Event): void {
    this.touchTimeout = setTimeout(() => {
      this.draggable = true;
      this.el.nativeElement.style.backgroundColor = '#0000001f'

      // this.el.nativeElement.style.boxShadow = 'inset black 1px 2px 20px -6px';
      // this.el.nativeElement.style.padding = '26px';
  // }


  // autoScroll([
  //   this.el.nativeElement
  //  ], {
  //   margin: 35,
  //   maxSpeed: 4,
  //   scrollWhenOutside: true,
  //   autoScroll(e) {
  //     console.log(e);

  //    return this.down;
  //   }
  // });


    }, this.delay);
  }

  @HostListener('touchmove', ['$event'])
  private onTouchMove(evt: Event): void {
    if (!this.draggable) {
      evt.stopPropagation();
      clearTimeout(this.touchTimeout);
      this.el.nativeElement.style.backgroundColor = null

      // autoScroll(this.el.nativeElement,{
      //   margin: 20,
      //   pixels: 5,
      //   scrollWhenOutside: false,
      //   autoScroll: function(e){
      //     console.log(e);

      //       // return this.down && drake.dragging;
      //   }
      //   })
      // this.el.nativeElement.style.boxShadow = null;
      // this.el.nativeElement.style.padding = null;
    }
  }

  @HostListener('touchend', ['$event'])
  private onTouchEnd(evt: Event): void {
    clearTimeout(this.touchTimeout);
    this.draggable = false;
    this.el.nativeElement.style.backgroundColor = null
    // this.el.nativeElement.style.boxShadow = null;
    // this.el.nativeElement.style.padding = null;
  }
}
