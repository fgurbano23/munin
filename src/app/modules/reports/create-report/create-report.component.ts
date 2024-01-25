import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateReportFormInterface } from './models/create-report-form.interface';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, JsonPipe, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-create-report',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    AsyncPipe,
    NgOptimizedImage,
    JsonPipe,
  ],
  templateUrl: './create-report.component.html',
  styleUrl: './create-report.component.scss',
})
export class CreateReportComponent {
  @ViewChild('canvas') canvasElement!: TemplateRef<HTMLCanvasElement>;

  private image = new BehaviorSubject<any>('');
  image$ = this.image.asObservable();

  data: any = null;
  form: FormGroup<CreateReportFormInterface> =
    this.fb.group<CreateReportFormInterface>({
      issue: new FormControl('', { validators: [Validators.required] }),
      description: new FormControl('', { validators: [Validators.required] }),
    });

  constructor(private fb: FormBuilder) {}

  async take() {
    Camera.getPhoto({
      source: CameraSource.Prompt,
      resultType: CameraResultType.DataUrl,
    }).then((res) => {
      this.data = res;
    });
  }
}
