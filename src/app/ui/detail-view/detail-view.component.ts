import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss'],
})
export class DetailViewComponent {
  isPractitioner = false;
  isPatient = false;
  constructor(
    public dialogRef: MatDialogRef<DetailViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { detailViewData: any },
  ) {}

  get details() {
    if (this.data.detailViewData.resourceType === 'Practitioner') {
      this.isPractitioner = true;
    }
    if (this.data.detailViewData.resourceType === 'Patient') {
      this.isPatient = true;
    }
    return this.data.detailViewData;
  }
}
