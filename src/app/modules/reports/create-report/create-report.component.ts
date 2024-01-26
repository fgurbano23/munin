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
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { PlatformService } from '../../../service/platform.service';
import { Capacitor } from '@capacitor/core';
import { SecondsPipe } from '../../../pipes/seconds.pipe';

declare var webkitSpeechRecognition: any;
declare var SpeechRecognition: any;

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
    MatIcon,
    SecondsPipe,
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

  images: string[] = [];
  audioClips: RecordingData[] = [];

  speechListening = '';
  speech = '';
  recognition: any = null;

  subj = new BehaviorSubject<string>('');
  obs$ = this.subj.asObservable();

  form: FormGroup<CreateReportFormInterface> =
    this.fb.group<CreateReportFormInterface>({
      issue: new FormControl('', { validators: [Validators.required] }),
      description: new FormControl('', { validators: [Validators.required] }),
    });

  constructor(
    private fb: FormBuilder,
    private platform: Platform,
    public matIconRegistry: MatIconRegistry,
    public platformService: PlatformService,
  ) {}

  async ngOnInit() {
    await VoiceRecorder.requestAudioRecordingPermission();

    this.recognition = this.createRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'es';

    this.recognition.onstart = () => {
      this.speechListening = 'Listening...';
    };

    this.recognition.onend = () => {
      this.speechListening = 'Ending...';
    };

    this.recognition.onresult = (e: any) => {
      console.log(e);

      const transcript = e.results[0][0].transcript;
      const confidence = e.results[0][0].confidence;
      const elref: any | undefined = document.querySelector('#speechText');

      if (elref) {
        elref.innerHTML = transcript;
      }

      console.log(transcript);
    };
  }

  getResult() {
    return this.speech;
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
        this.images.push(photo.webPath!);

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
    this.recognition.start();

    VoiceRecorder.startRecording();
  }

  stopRecording() {
    if (!this.recording) {
      return;
    }

    this.recording = false;
    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
      if (result.value && result.value.recordDataBase64) {
        this.audioClips.push(result);
      }
    });
    this.recognition.stop();
  }

  async playRecord(audio: RecordingData) {
    try {
      const mimeType =
        Capacitor.getPlatform() === 'web'
          ? 'audio/webm;codecs=opus'
          : 'audio/aac';

      const audioRef = new Audio(
        `data:${mimeType};base64, ${audio.value.recordDataBase64}`,
      );
      audioRef.oncanplaythrough = () => audioRef.play();
      audioRef.load();
    } catch (e) {
      console.log(e);
    }
  }

  deleteClip(index: number) {
    this.audioClips.splice(index, 1);
  }

  deleteImage(index: number) {
    this.images.splice(index, 1);
  }

  continuousSpeeching() {
    this.recognition.start();
  }

  createRecognition = () => {
    const recognition =
      new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    return recognition;
  };
}
