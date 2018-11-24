import { Directive, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[ion-refresh-native]', // Attribute selector
  host: {
	  '(ionPull)': 'handlePull($event)'
  }
})
export class IonRefreshNative {

	private ionPulling;
	private ionPullingIcon;
	private ionRefreshing;

	constructor(
		public element: ElementRef,
		public renderer: Renderer
	) {
	}

	handlePull(event) {
		let ready = false;
		let rotation = event.deltaY + 100;
		let max = Number(event.pullMax);

		if (event.deltaY.toFixed(0) < max.toFixed(0)) {

			this.ionPulling = this.element.nativeElement.getElementsByClassName('refresher-pulling')[0];
			this.ionPullingIcon = this.element.nativeElement.getElementsByClassName('refresher-pulling-icon')[0];
			this.ionRefreshing = this.element.nativeElement.getElementsByClassName('refresher-refreshing')[0];

			if (event.state == 'pulling' && !ready) {
				this.renderer.setElementAttribute(this.ionPulling, 'style', 'transition: ease-in-out 250ms transform');
				this.renderer.setElementAttribute(this.ionPulling, 'style', `top: ${event.deltaY.toFixed(0)}px!important;`);
				this.renderer.setElementAttribute(this.ionPullingIcon, 'style', 'transition: ease-in-out 250ms transform');
				this.renderer.setElementAttribute(this.ionPullingIcon, 'style', `transform: rotate(${rotation.toFixed(0)}deg)`);
			}
			if (event.state == 'ready' || event.state == 'refreshing') {
				ready = true;
				this.renderer.setElementAttribute(this.ionRefreshing, 'style', 'transition: ease-in-out 250ms transform');
				this.renderer.setElementAttribute(this.ionRefreshing, 'style', `transform: translateY(50px) translateZ(0px)!important;`);
			}
		}
	}
}
