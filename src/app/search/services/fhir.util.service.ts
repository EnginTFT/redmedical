import { Injectable } from '@angular/core';
import {
  IFhirPatient,
  IFhirPractitioner,
  IFhirResourceAddress,
  IFhirResourceHumanName,
  IPreparedIFhirPatient,
  IPreparedIFhirPractitioner,
} from '@red-probeaufgabe/types';
import { SearchModule } from '../search.module';

@Injectable({ providedIn: SearchModule })
export class FhirUtilService {
  private static getFhirNameRepresentation(name: IFhirResourceHumanName): string {
    const family = name.family ? `${name.family},` : '';
    const prefix = name.prefix ? ` ${name.prefix.join(' ')}` : '';
    const given = name.given ? ` ${name.given.join(' ')}` : '';
    const suffix = name.suffix ? ` ${name.suffix.join(' ')}` : '';

    return `${family}${prefix}${given}${suffix}`;
  }

  private static getFhirAddressRepresentation(address: IFhirResourceAddress): string {
    const line = address.line ? `${address.line}\n` : '';
    const city = address.city ? `${address.city}\n` : '';
    const postalCode = address.postalCode ? `${address.postalCode}\n` : '';
    const state = address.state ? `${address.state}` : '';

    return `${line}${city}${postalCode}${state}`;
  }

  private static getFhirPatientRepresentation(data: IFhirPatient) {
    return {
      resourceType: data.resourceType,
      id: data.id,
      birthDate: data.birthDate,
      gender: data.gender,
    };
  }
  private static getFhirPractitionerRepresentation(data: IFhirPractitioner) {
    return {
      resourceType: data.resourceType,
      id: data.id,
      telecom: data.telecom,
    };
  }

  /**
   * Prepare FHIR data for detail view
   * @param data
   */
  prepareData(data: IFhirPatient | IFhirPractitioner): IPreparedIFhirPatient | IPreparedIFhirPractitioner {
    let preparedData;
    if (data.resourceType == 'Patient') {
      preparedData = FhirUtilService.getFhirPatientRepresentation(data as IFhirPatient);
    }
    if (data.resourceType == 'Practitioner') {
      preparedData = FhirUtilService.getFhirPractitionerRepresentation(data as IFhirPractitioner);
    }
    const address = data.address?.map((resourceAddress: IFhirResourceAddress) =>
      FhirUtilService.getFhirAddressRepresentation(resourceAddress),
    );
    const name = data.name?.map((humanName: IFhirResourceHumanName) =>
      FhirUtilService.getFhirNameRepresentation(humanName),
    );

    return { ...preparedData, address, name };
  }
}
