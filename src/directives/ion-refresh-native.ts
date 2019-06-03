import {Directive, ElementRef, Renderer, Input} from '@angular/core';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { Refresher } from 'ionic-angular/umd/components/refresher/refresher';

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
   @Input('refresh-timeout') refreshTimeout: number;

   private STATE = {
      comleting: 'completing',
      inactive: 'inactive',
      pulling: 'pulling',
      ready: 'ready',
      refreshing: 'refreshing',
   };
   private pullTimeout: any;
   private ionPulling;
   private ionPullingIcon;
   private ionRefreshing;
   private ionRefresher: Refresher;

   public progress;
   public rotation;

   constructor(public element : ElementRef, public renderer : Renderer, public navCtrl: NavController) { }

   handleStart(event) {
    const activePage = this.navCtrl.getActive();
    const contentElement = activePage.getIONContentRef().nativeElement;
    if (!this.ionPulling || !this.ionPullingIcon || !this.ionRefreshing) {
        this.ionPulling = contentElement.getElementsByClassName('refresher-pulling-icon')[0];
        this.ionPullingIcon = contentElement.querySelector('.refresher-pulling-icon > ion-icon');
        this.ionRefreshing = contentElement.getElementsByClassName('refresher-refreshing')[0];
        this.ionRefresher = activePage.instance.ionRefresher;
    }
   }

   handlePull(event) {
      this.progress = event.progress * event.pullMin + event.deltaY;
      this.rotation = this.progress * 2;
      this.ionRefreshPosition = this.ionRefreshPosition || 55;
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
      clearTimeout(this.pullTimeout);
      if (typeof this.ionRefresher !== 'undefined') {
         this.pullTimeout = setTimeout(() => {
            this.ionRefresher.cancel();
          }, this.refreshTimeout || 3000);
      }
   }

   handleRefresh(event) {
    clearTimeout(this.pullTimeout);
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