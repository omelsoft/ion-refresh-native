import {Directive, ElementRef, Renderer, Input} from '@angular/core';

@Directive({
   selector: '[ion-refresh-native]', // Attribute selector
   host: {
      '(ionStart)': 'handleStart($event)',
      '(ionPull)': 'handlePull($event)',
      '(ionRefresh)': 'handleRefresh($event)'
   }
})
export class IonRefreshNative {
   @Input('ion-refresh-position') ionRefreshPosition: number;

   private STATE = {
      comleting: 'completing',
      inactive: 'inactive',
      pulling: 'pulling',
      ready: 'ready',
      refreshing: 'refreshing',
   };

   private ionPulling;
   private ionPullingIcon;
   private ionRefreshing;

   public progress;
   public rotation;

   constructor(public element : ElementRef, public renderer : Renderer) {}

   handleStart(event) {
      if (!this.ionPulling || !this.ionPullingIcon || !this.ionRefreshing) {
         this.ionPulling = this.element.nativeElement.getElementsByClassName('refresher-pulling-icon')[0];
         this.ionPullingIcon = document.querySelector('.refresher-pulling-icon > ion-icon');
         this.ionRefreshing = this.element.nativeElement.getElementsByClassName('refresher-refreshing')[0];
      }
   }

   handlePull(event) {

      this.progress = event.progress * event.pullMin + event.deltaY;
      this.rotation = this.progress * 2;
      this.ionRefreshPosition = this.ionRefreshPosition ? this.ionRefreshPosition : 55;

      if (this.progress < event.pullMax) {
         this.setStyle(
               this.ionPulling,
               'style',
               `top: ${this.progress}px!important;
               transition: ease-in-out 250ms top;`
               );
         this.setStyle(
            this.ionPullingIcon,
            'style',
            `opacity: ${event.progress};
            transform: rotate(${this.rotation.toFixed(0)}deg);
            transition: ease-in-out 300ms transform;`
            );
      }
      if (event.state == this.STATE.ready) {
         this.setStyle(
            this.ionPullingIcon,
            'style',
            `opacity: ${event.progress};
            transform: rotate(270deg);
            transition: ease-in-out 100ms transform;`
            );
      }
   }

   handleRefresh(event) {
      this.setStyle(
         this.ionRefreshing,
         'style',
         `transform: translateY(${this.ionRefreshPosition}px) translateZ(0px)!important;
         transition: ease-in-out 1000ms transform;`
         );
      this.resetPullingStyle()
   }

   setStyle(element : ElementRef, attr, value) {
      this.renderer.setElementAttribute(element, attr, value);
   }

   resetPullingStyle() {
      this.setStyle(
         this.ionPulling,
         'style',
         `top: 10px!important;
         transition: ease-in-out 250ms top;`
      );
      this.setStyle(
         this.ionPullingIcon,
         'style',
         `transform: rotate(0deg);opacity:0;
         transition: ease-in-out 250ms transform;`
      );

   }
}
