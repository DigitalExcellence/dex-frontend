import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() amountOfProjectsOnSinglePage: number;
  @Input() totalNumberOfProjects: number;
  @Input() showPaginationFooter: boolean;

  @Output() pageChanged = new EventEmitter<number>();

}
