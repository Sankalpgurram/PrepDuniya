import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileService } from '../../../core/services/profile.service';
import { UserStateService } from '../../../core/services/user-state.service';
import { pageAnimations, fadeIn } from '../../../shared/animations';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  animations: [pageAnimations, fadeIn]
})
export class SettingsComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  preferencesForm: FormGroup;
  loading = false;
  uploading = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    public userStateService: UserStateService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      profile_picture: ['']
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.preferencesForm = this.fb.group({
      darkMode: [false],
      emailNotifications: [true]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  loadProfile() {
    this.profileService.getProfile().subscribe(res => {
      if (res.success) {
        this.profileForm.patchValue({
          name: res.data.name,
          profile_picture: res.data.profile_picture
        });
        if (res.data.preferences) {
          this.preferencesForm.patchValue(res.data.preferences);
        }
      }
    });
  }

  getProfilePicUrl(path: string | null | undefined): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:3000/${path}`;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }

      this.uploading = true;
      this.profileService.uploadProfilePicture(file).subscribe({
        next: (res: any) => {
          this.uploading = false;
          if (res.success) {
            this.profileForm.patchValue({
              profile_picture: res.data.profile_picture
            });
            const currentProfile = this.userStateService.userProfile();
            if (currentProfile) {
              this.userStateService.setUserProfile({
                ...currentProfile,
                profile_picture: res.data.profile_picture
              });
            }
            alert('Profile picture uploaded successfully!');
          }
        },
        error: (err: any) => {
          this.uploading = false;
          alert(err.error?.message || 'Failed to upload profile picture.');
        }
      });
    }
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.loading = true;
      const data = {
        ...this.profileForm.value,
        preferences: this.preferencesForm.value
      };
      this.profileService.updateProfile(data).subscribe({
        next: () => {
          this.loading = false;
          const currentProfile = this.userStateService.userProfile();
          if (currentProfile) {
            this.userStateService.setUserProfile({
              ...currentProfile,
              name: data.name,
              profile_picture: data.profile_picture,
              preferences: data.preferences
            });
          }
          alert('Profile updated successfully!');
        },
        error: () => (this.loading = false)
      });
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      this.loading = true;
      this.profileService.changePassword(this.passwordForm.value).subscribe({
        next: () => {
          this.loading = false;
          alert('Password changed successfully!');
          this.passwordForm.reset();
        },
        error: (err) => {
          this.loading = false;
          alert(err.error.message || 'Failed to change password');
        }
      });
    }
  }
}
