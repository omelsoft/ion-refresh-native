import { NgModule } from '@angular/core';
import { IonRefreshNative } from './directives/ion-refresh-native';

@NgModule({
    declarations: [
        IonRefreshNative
    ],
    exports: [
        IonRefreshNative
    ]
})
export class IonRefreshNativeModule {
}
