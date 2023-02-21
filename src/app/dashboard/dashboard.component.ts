import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, tap } from 'rxjs/operators';
import { SiteTitleService } from '@red-probeaufgabe/core';
import {
  FhirSearchFn,
  IFhirPatient,
  IFhirPractitioner,
  IFhirSearchResponse,
  IPreparedIFhirPatient,
  IPreparedIFhirPractitioner,
} from '@red-probeaufgabe/types';
import { DetailViewComponent, IUnicornTableColumn } from '@red-probeaufgabe/ui';
import { FhirUtilService, SearchFacadeService } from '@red-probeaufgabe/search';
import { SearchFormSubmitValues } from 'app/ui/search-form/models/search-form-submit-values';
import { MatDialog } from '@angular/material/dialog';

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

  searchType: FhirSearchFn = FhirSearchFn.SearchAll;
  query = '';
  /*
   * Implement search on keyword or fhirSearchFn change
   **/
  search$: Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>> = this.searchFacade
    .search(this.searchType, this.query)
    .pipe(
      catchError(this.handleError),
      tap(() => {
        this.isLoading = false;
      }),
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
  // Hier wurde die Abstrakte Klasse AbstractSearchFacadeService importiert und benutzt. Eine Abstrakte Klasse ist nur eine "Bauanleitung".
  // Die AbstractSearchFacadeService wird vom SearchFacadeService extended.
  constructor(
    private siteTitleService: SiteTitleService,
    private searchFacade: SearchFacadeService,
    private utilService: FhirUtilService,
    public dialog: MatDialog,
  ) {
    this.siteTitleService.setSiteTitle('Dashboard');
  }

  private handleError(): Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>> {
    return of({ entry: [], total: 0 });
  }
  onSubmit(searchFormValues: SearchFormSubmitValues) {
    this.search$ = this.searchFacade.search(searchFormValues.filter, searchFormValues.search).pipe(
      catchError(this.handleError),
      tap(() => {
        this.isLoading = false;
      }),
    );

    this.entries$ = this.search$.pipe(
      map((data) => !!data && data.entry),
      startWith([]),
    );

    this.totalLength$ = this.search$.pipe(
      map((data) => !!data && data.total),
      startWith(0),
    );
  }
  onRowClick(row: any) {
    const dialogRef = this.dialog.open(DetailViewComponent, {
      data: {
        detailViewData: this.utilService.prepareData(row),
      },
    });
  }
}
