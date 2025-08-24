import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-modal',
  imports: [CommonModule],
  templateUrl: './job-modal.html',
  styleUrl: './job-modal.css',
})
export class JobModal {
  @Input() job: any; // job data passed from parent
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
