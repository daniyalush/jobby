import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-card.html',
  styleUrls: ['./job-card.css'],
})
export class JobCard {
  @Input() job: any;
  @Output() expand = new EventEmitter<any>();

  onExpandClick() {
    this.expand.emit(this.job);
  }
}
