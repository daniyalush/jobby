import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { io, Socket } from 'socket.io-client';
import { JobService } from '../../services/job';
import { JobCard } from '../../components/job-content/job-card/job-card';
import { JobModal } from '../../components/job-content/job-modal/job-modal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, JobCard, JobModal],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit, OnDestroy {
  jobs: any[] = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 12;
  selectedJob: any = null;
  private socket!: Socket;

  constructor(private jobService: JobService) {}

  async ngOnInit() {
    // Fetch initial jobs
    this.jobs = await this.jobService.getJobs();

    // Sort newest first
    this.jobs.sort(
      (a, b) =>
        new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
    );

    // Connect to WebSocket
    this.socket = io('http://localhost:5000');

    // Listen for new jobs (avoid duplicates by URL)
    this.socket.on('new-job', (job: any) => {
      if (!this.jobs.some((j) => j?.url === job?.url)) {
        this.jobs.unshift(job);
      }
    });
  }

  ngOnDestroy() {
    if (this.socket) this.socket.disconnect();
  }

  filteredJobs() {
    const term = this.searchTerm.toLowerCase();
    return this.jobs.filter((job) => {
      const title = job?.title?.toLowerCase?.() || '';
      const company = job?.company?.toLowerCase?.() || '';
      const skills = job?.skills?.toLowerCase?.() || '';
      return (
        title.includes(term) || company.includes(term) || skills.includes(term)
      );
    });
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

  openJobModal(job: any) {
    this.selectedJob = job;
  }

  closeJobModal() {
    this.selectedJob = null;
  }

  trackByJobUrl(index: number, job: any): string {
    return job.url; // or job.id if you have an id
  }
}
