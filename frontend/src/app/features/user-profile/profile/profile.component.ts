import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProfileService } from '../../../core/services/profile.service';
import { UserStateService } from '../../../core/services/user-state.service';
import { pageAnimations, fadeIn, cardHover } from '../../../shared/animations';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [pageAnimations, fadeIn, cardHover]
})
export class ProfileComponent implements OnInit {
  userProfile: any = null;
  loading = true;

  constructor(
    private profileService: ProfileService,
    public userState: UserStateService
  ) { }

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile() {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        if (res.success) {
          this.userProfile = res.data;
          this.userState.setUserProfile(res.data);
        }
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  getAvatar() {
    return this.userProfile?.profile_picture || 'assets/default-avatar.png';
  }
}
