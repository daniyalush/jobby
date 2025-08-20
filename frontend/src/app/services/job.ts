import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class JobService {
  private apiUrl = 'http://localhost:5000/api/jobs/db';

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
