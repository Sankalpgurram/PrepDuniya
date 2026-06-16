import { Injectable, Inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  // Signals
  public skills = signal<string[]>([]);
  public atsScore = signal<number | null>(null);
  public lastAnalysisDate = signal<Date | null>(null);
  public userProfile = signal<any>(null);

  // Computed Values (examples of derived state)
  public hasSkills = computed(() => this.skills().length > 0);
  public isActive = computed(() => this.userProfile() !== null);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadState();
  }

  private loadState() {
    if (isPlatformBrowser(this.platformId)) {
      const savedSkills = localStorage.getItem('user_skills');
      if (savedSkills) {
        try {
          this.skills.set(JSON.parse(savedSkills));
        } catch (e) {
          console.error('Error parsing skills from localStorage', e);
        }
      }

      const savedScore = localStorage.getItem('user_ats_score');
      if (savedScore) {
        this.atsScore.set(Number(savedScore));
      }

      const savedDate = localStorage.getItem('user_last_analysis_date');
      if (savedDate) {
        this.lastAnalysisDate.set(new Date(savedDate));
      }
    }
  }

  setSkills(newSkills: string[]) {
    this.skills.set(newSkills);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user_skills', JSON.stringify(newSkills));
    }
  }

  setAtsScore(score: number) {
    this.atsScore.set(score);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user_ats_score', score.toString());
    }
  }

  setLastAnalysisDate(date: Date) {
    this.lastAnalysisDate.set(date);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user_last_analysis_date', date.toISOString());
    }
  }

  setUserProfile(profile: any) {
    this.userProfile.set(profile);
  }
}
