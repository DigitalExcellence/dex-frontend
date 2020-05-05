import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector, TemplateRef } from '@angular/core';
import { ModalComponent } from '../components/modal/modal.component';

@Injectable()
export class ModalService {

  constructor(
      private componentFactoryResolver: ComponentFactoryResolver,
      private appRef: ApplicationRef,
      private injector: Injector
  ) { }

  private static resolveNgContent(templateRef: TemplateRef<any>) {
    const viewRef = templateRef.createEmbeddedView(null);

    return [viewRef.rootNodes];
  }

  create(templateRef: TemplateRef<any>): ComponentRef<ModalComponent> {
    const modalContent = ModalService.resolveNgContent(templateRef);
    const modalRef = this.appendComponentToBody(modalContent);

    modalRef.instance.close.subscribe(() => {
      setTimeout(() => {
        this.destroyComponent(modalRef);
      }, 150);
    });

    return modalRef;
  }

  show(templateRef: TemplateRef<any>): ComponentRef<ModalComponent> {
    const modalRef = this.create(templateRef);

    setTimeout(() => {
      modalRef.instance.open = true;
    }, 200);

    return modalRef;
  }

  destroyComponent(componentRef: ComponentRef<any>): void {
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }

  private appendComponentToBody(modalContent: any[][]): ComponentRef<ModalComponent> {
    // As per https://hackernoon.com/angular-pro-tip-how-to-dynamically-create-components-in-body-ba200cc289e6

    // 1. Create a component reference from the component
    const componentRef = this.componentFactoryResolver
        .resolveComponentFactory(ModalComponent)
        .create(this.injector, modalContent);

    // 2. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(componentRef.hostView);

    // 3. Get DOM element from component
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    // 4. Append DOM element to the body
    document.body.appendChild(domElem);

    return componentRef;
  }
}
