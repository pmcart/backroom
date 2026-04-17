import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EditableMethodology } from '../../features/admin/methodology/methodology';

@Injectable({ providedIn: 'root' })
export class MethodologyService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/methodology`;

  get(): Observable<EditableMethodology> {
    return this.http.get<EditableMethodology>(this.base);
  }

  save(payload: EditableMethodology): Observable<EditableMethodology> {
    return this.http.put<EditableMethodology>(this.base, payload);
  }
}
