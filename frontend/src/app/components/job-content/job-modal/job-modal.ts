import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-modal.html',
  styleUrls: ['./job-modal.css'],
})
export class JobModal {
  @Input() job: any;
  @Output() close = new EventEmitter<void>();

  isClosing = false;

  onClose() {
    this.isClosing = true;
    // Wait for fade-out animation to finish
    setTimeout(() => {
      this.close.emit();
      this.isClosing = false;
    }, 250);
  }
}
