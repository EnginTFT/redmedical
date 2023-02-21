import { FhirSearchFn } from '@red-probeaufgabe/types';

export interface SearchFormSubmitValues {
  search: string;
  filter: FhirSearchFn;
}
