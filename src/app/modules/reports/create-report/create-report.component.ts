import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { Platform } from '@angular/cdk/platform';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';

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
export class CreateReportComponent implements OnInit {
  @ViewChild('canvas') canvasElement!: TemplateRef<HTMLCanvasElement>;

  private image = new BehaviorSubject<any>('');
  image$ = this.image.asObservable();

  recording = false;
  data: any = null;
  photo: any = null;
  error: any = null;
  blob: any = null;

  audio: any = null;

  directoryFileNames: any[] = [];

  form: FormGroup<CreateReportFormInterface> =
    this.fb.group<CreateReportFormInterface>({
      issue: new FormControl('', { validators: [Validators.required] }),
      description: new FormControl('', { validators: [Validators.required] }),
    });

  constructor(
    private fb: FormBuilder,
    private platform: Platform,
  ) {}

  async ngOnInit() {
    await VoiceRecorder.requestAudioRecordingPermission();
  }

  async take() {
    try {
      const photo = await Camera.getPhoto({
        width: 500,
        quality: 50,
        saveToGallery: true,
        source: CameraSource.Camera,
        resultType: CameraResultType.Uri,
      });
      if (photo) {
        this.photo = photo.webPath;
        this.data = photo.webPath;
      }
    } catch (e) {
      this.error = e;
    }
  }

  async startRecording() {
    if (this.recording) {
      return;
    }
    this.recording = true;
    VoiceRecorder.startRecording();
  }

  stopRecording() {
    if (!this.recording) {
      return;
    }

    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
      if (result.value && result.value.recordDataBase64) {
        this.audio = result.value.recordDataBase64;
      }
    });
  }

  async playRecord() {
    try {
      const audioRef = new Audio(
        `data:audio/webm;codecs=opus;base64, ${this.audio}`,
      );
      audioRef.oncanplaythrough = () => audioRef.play();
      audioRef.load();
    } catch (e) {
      console.log(e);
    }
  }
}
