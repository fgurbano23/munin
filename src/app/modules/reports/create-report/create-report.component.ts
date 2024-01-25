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

import {
  Camera,
  CameraPhoto,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, JsonPipe, NgOptimizedImage } from '@angular/common';
import { CapacitorPlatform } from '@capacitor/core/types/platforms';
import { Platform } from '@angular/cdk/platform';

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
  error: any = null;

  form: FormGroup<CreateReportFormInterface> =
    this.fb.group<CreateReportFormInterface>({
      issue: new FormControl('', { validators: [Validators.required] }),
      description: new FormControl('', { validators: [Validators.required] }),
    });

  constructor(
    private fb: FormBuilder,
    private platform: Platform,
  ) {}

  async take() {
    try {
      const photo = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.Uri,
      });
      if (photo) {
        const res = await fetch(photo.webPath!);
        const blob = await res.blob();
        const b64 = await this.blobToBase64(blob);
        this.data = b64;
      }
    } catch (e) {
      this.error = e;
    }
  }

  blobToBase64(blob: Blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
}
