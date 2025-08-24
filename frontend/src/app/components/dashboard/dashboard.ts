import { Component, OnInit, OnDestroy } from '@angular/core';
import { JobService } from '../../services/job';
import { io, Socket } from 'socket.io-client';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobModal } from '../job-modal/job-modal';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, JobModal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  selectedJob: any = null;
  jobs: any[] = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 12;
  private socket!: Socket;

  constructor(private jobService: JobService) {}

  async ngOnInit() {
    // Fetch initial jobs from DB
    this.jobs = await this.jobService.getJobs();

    // Sort newest first
    this.jobs.sort(
      (a, b) =>
        new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
    );

    // Connect to WebSocket server
    this.socket = io('http://localhost:5000'); // no /api path

    // Listen for new jobs
    this.socket.on('new-job', (job: any) => {
      // Avoid duplicates
      if (!this.jobs.some((j) => j.url === job.url)) {
        this.jobs.unshift(job); // add new job at the top
      }
    });
  }

  openJobModal(job: any) {
    this.selectedJob = job;
  }

  closeJobModal() {
    this.selectedJob = null;
  }

  ngOnDestroy() {
    if (this.socket) this.socket.disconnect();
  }

  filteredJobs() {
    const term = this.searchTerm.toLowerCase();
    return this.jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term) ||
        job.skills.toLowerCase().includes(term)
    );
  }

  paginatedJobs() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredJobs().slice(start, start + this.itemsPerPage);
  }

  totalPages() {
    const total = Math.ceil(this.filteredJobs().length / this.itemsPerPage);
    return total > 0 ? total : 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  onSearchChange() {
    this.currentPage = 1;
  }
}
