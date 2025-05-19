import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeezerService {
  private apiUrl = 'https://deezerdevs-deezer.p.rapidapi.com/search';
  private headers = new HttpHeaders({
    'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
    'x-rapidapi-key': 'e2482d1a62msh9c4961705e666eep10c24ajsnca971bf11ec6',
  });

  constructor(private http: HttpClient) {}

  async searchTracks(query: string): Promise<any[]> {
    const url = `${this.apiUrl}?q=${encodeURIComponent(query)}`;
    try {
      const res: any = await firstValueFrom(this.http.get(url, { headers: this.headers }));
      return res?.data || [];
    } catch (e) {
      console.error('Deezer search error:', e);
      return [];
    }
  }
}
