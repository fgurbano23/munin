import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';

type PlatformType = 'ios' | 'web' | 'android';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  constructor() {}

  getPlatformType(): PlatformType {
    return Capacitor.getPlatform() as PlatformType;
  }
}
