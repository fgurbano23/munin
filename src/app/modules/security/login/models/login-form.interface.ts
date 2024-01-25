import {FormControl} from "@angular/forms";

export interface LoginFormInterface {
  user: FormControl<string| null>;
  password: FormControl<string |null>;
}
