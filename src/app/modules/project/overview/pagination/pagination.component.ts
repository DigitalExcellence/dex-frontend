import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() amountOfProjectsOnSinglePage: number;
  @Input() totalNumberOfProjects: number;
  @Input() showPaginationFooter: Boolean;

  @Output() pageChanged = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

}
