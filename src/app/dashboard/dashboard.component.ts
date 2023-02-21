import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, tap } from 'rxjs/operators';
import { SiteTitleService } from '@red-probeaufgabe/core';
import { FhirSearchFn, IFhirPatient, IFhirPractitioner, IFhirSearchResponse } from '@red-probeaufgabe/types';
import { IUnicornTableColumn } from '@red-probeaufgabe/ui';
import { AbstractSearchFacadeService, SearchFacadeService } from '@red-probeaufgabe/search';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  // Init unicorn columns to display
  columns: Set<IUnicornTableColumn> = new Set<IUnicornTableColumn>([
    'number',
    'resourceType',
    'name',
    'gender',
    'birthDate',
  ]);
  isLoading = true;

  /*
   * Implement search on keyword or fhirSearchFn change
   **/
  search$: Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>> = this.searchFacade
    .search(FhirSearchFn.SearchAll, '')
    .pipe(
      catchError(this.handleError),
      tap(() => {
        this.isLoading = false;
      }),
      shareReplay(),
    );

  entries$: Observable<Array<IFhirPatient | IFhirPractitioner>> = this.search$.pipe(
    map((data) => !!data && data.entry),
    startWith([]),
  );

  totalLength$ = this.search$.pipe(
    map((data) => !!data && data.total),
    startWith(0),
  );

  // Aufgabe 1 Fehlersuche
  // Hier wurde die Abstrakte Klasse AbstractSearchFacadeService importiert und benutzt. EIne Abstrakte Klasse ist nur eine "Bauanleitung".
  // Die AbstractSearchFacadeService wird vom SearchFacadeService extended.
  constructor(private siteTitleService: SiteTitleService, private searchFacade: SearchFacadeService) {
    this.siteTitleService.setSiteTitle('Dashboard');
  }

  private handleError(): Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>> {
    return of({ entry: [], total: 0 });
  }
}
