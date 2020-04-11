import { Component, OnInit } from '@angular/core';
import { ExternalSource } from 'src/app/models/domain/external-source';

/**
 * Component to import projects from external sources
 */
@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent implements OnInit {

  /**
   * ExternalSources available to import your projects from
   */
  public mostUsedSources: ExternalSource[] = [];

  constructor() { }

  ngOnInit(): void {
    const demoSource: ExternalSource = {
      id: 1,
      name: 'gitHub',
      image: 'assets/github-logo.svg'
    };
    for (let index = 0; index < 6; index++) {
      demoSource.id = demoSource.id + index;
      this.mostUsedSources.push(demoSource);
    }
  }

}
