import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FhirSearchFn } from '@red-probeaufgabe/types';
import { SearchFormSubmitValues } from './models/search-form-submit-values';
@Component({
  selector: 'app-search',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<SearchFormSubmitValues>();

  formGroup: FormGroup;
  filterValues = FhirSearchFn;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      search: ['', [Validators.pattern(/^[^0-9\s\u00C4\u00E4\u00D6\u00F6\u00DC\u00FC]+$/), Validators.minLength(0)]],
      filter: [this.filterValues.SearchAll],
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.formSubmitted.emit({
        search: this.formGroup.get('search').value,
        filter: this.formGroup.get('filter').value,
      });
    }
  }
}
