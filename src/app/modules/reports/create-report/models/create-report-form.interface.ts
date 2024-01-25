import { FormControl } from '@angular/forms';

export interface CreateReportFormInterface {
  issue: FormControl<string | null>;
  description: FormControl<string | null>;
}
