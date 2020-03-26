import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/domain/project';
import { User } from 'src/app/models/domain/user';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  tempUser: User = {
    id: 1,
    profileUrl: '',
    username: 'Kasper Hämäläinen'
  };
  project: Project = {
    id: 0,
    name: 'FEEL THE SPARK - GLOW 2018',
    shortDescription: 'Etiam rhoncus maecenas tempus tellus eget condimentum rhoncus.',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' +
      'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, ' +
      'when an unknown printer took a galley of type and scrambled it to make a type specimen book. ' +
      'It has survived not only five centuries, but also the leap into electronic typesetting, ' +
      'remaining essentially unchanged. It was popularised in the 1960s with the release ' +
      'of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop ' +
      'publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    createdDate: new Date('2018-11-20'),
    url: 'https://git.fhict.nl/delta-projecten/feel-the-spark',
    user: this.tempUser,
    contributors: ['Kasper Hämäläinen', 'Davey Hurkmans', 'Max Korlaar', 'Yevheniia Buzykina'
      , 'Rebecca Zwijnenburg', 'Vincent Venhuizen', 'Marius Cojocaru Alexandru', 'Martijn Stommels']
  };

  constructor() { }

  ngOnInit(): void {
  }

}
