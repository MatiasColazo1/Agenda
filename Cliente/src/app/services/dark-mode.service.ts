import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private renderer: Renderer2;
  public isDarkMode = false;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.loadDarkModeState();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.applyDarkMode(this.isDarkMode);
    this.saveDarkModeState();
  }

  private applyDarkMode(isDarkMode: boolean) {
    const body = document.body;
    if (isDarkMode) {
      this.renderer.addClass(body, 'dark-mode');
    } else {
      this.renderer.removeClass(body, 'dark-mode');
    }
  }

  private saveDarkModeState() {
    localStorage.setItem('darkMode', JSON.stringify(this.isDarkMode));
  }

  private loadDarkModeState() {
    const storedDarkMode = localStorage.getItem('darkMode');
    this.isDarkMode = storedDarkMode ? JSON.parse(storedDarkMode) : false;
    this.applyDarkMode(this.isDarkMode);
  }

  
}
