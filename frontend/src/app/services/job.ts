import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class JobService {
  private apiUrl =
    'https://17c2d292-61f0-4256-8156-cb9b473ba101-00-114sd6t7j0nri.pike.replit.dev/api/jobs/db';

  async getJobs(): Promise<any[]> {
    try {
      const response = await axios.get(this.apiUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  }
}
