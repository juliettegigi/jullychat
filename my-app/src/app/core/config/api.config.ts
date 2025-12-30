import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export function getApiUrl(platformId: Object): string {
  return isPlatformBrowser(platformId)
    ? window.location.origin
    : '';
}