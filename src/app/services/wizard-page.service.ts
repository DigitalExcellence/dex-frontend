import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ComponentLoader {
  loadChildren: () => Promise<any>;
}

@Injectable({
  providedIn: 'root'
})
export class WizardPageService {
  constructor(private cfr: ComponentFactoryResolver) {}

  forChild(vcr: ViewContainerRef, cl: ComponentLoader): Observable<ComponentRef<any>> {
    return from(cl.loadChildren()).pipe(
        map((component: any) => this.cfr.resolveComponentFactory(component)),
        map(componentFactory => vcr.createComponent(componentFactory))
    );
  }
}
