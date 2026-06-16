import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CodingService } from '../coding.service';

const STARTER: Record<string, string> = {
  javascript: `// Write your solution here
function solution(nums, target) {
  // your code here

}`,
  python: `# Write your solution here
def solution(nums, target):
    # your code here
    pass`,
  java: `// Write your solution here
class Solution {
    public int[] solve(int[] nums, int target) {
        // your code here
        return new int[]{};
    }
}`,
  cpp: `// Write your solution here
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> solve(vector<int>& nums, int target) {
        // your code here
        return {};
    }
};`,
  typescript: `// Write your solution here
function solution(nums: number[], target: number): number[] {
  // your code here
  return [];
}`,
};

@Component({
  selector: 'app-problem-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,
            MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './problem-detail.component.html',
  styleUrl:    './problem-detail.component.css'
})
export class ProblemDetailComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private coding = inject(CodingService);

  problem          = signal<any>(null);
  isLoading        = signal(true);
  loadError        = signal('');
  isSubmitting     = signal(false);
  result           = signal<any>(null);
  showResult       = signal(false);
  selectedLanguage = signal('javascript');
  codeText         = STARTER['javascript'];

  languages = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'python',     label: 'Python',     icon: '🐍' },
    { value: 'java',       label: 'Java',       icon: '☕' },
    { value: 'cpp',        label: 'C++',        icon: '⚙️' },
    { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  ];

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.coding.getProblem(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.problem.set(res.data);
          // Use problem's starter code if available
          const starter = res.data.starter_code?.['javascript'] ?? STARTER['javascript'];
          this.codeText = starter;
        } else {
          this.loadError.set('Problem not found.');
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.loadError.set('Could not load problem. Please ensure you are logged in and the server is running.');
        this.isLoading.set(false);
      }
    });
  }

  changeLanguage(lang: string) {
    this.selectedLanguage.set(lang);
    this.codeText = this.problem()?.starter_code?.[lang] ?? STARTER[lang];
  }

  resetCode() {
    const lang = this.selectedLanguage();
    this.codeText = this.problem()?.starter_code?.[lang] ?? STARTER[lang];
  }

  // Only intercept Tab — let every other key pass through untouched
  handleKey(event: KeyboardEvent): boolean {
    if (event.key !== 'Tab') {
      return true; // MUST return true so Angular doesn't call preventDefault on normal keys
    }
    // Tab key: insert 2 spaces instead of shifting focus
    event.preventDefault();
    const ta = event.target as HTMLTextAreaElement;
    const start = ta.selectionStart ?? 0;
    const end   = ta.selectionEnd ?? 0;
    this.codeText = this.codeText.substring(0, start) + '  ' + this.codeText.substring(end);
    setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 2; }, 0);
    return false;
  }

  submitCode() {
    const p = this.problem();
    if (!p || this.isSubmitting()) return;
    const code = this.codeText.trim();
    if (!code) return;

    this.isSubmitting.set(true);
    this.showResult.set(false);

    this.coding.submitCode(p.id, this.selectedLanguage(), code).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) { this.result.set(res.data); this.showResult.set(true); }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.result.set({ status: 'runtime_error', feedback: 'Submission failed. Please try again.', score: 0 });
        this.showResult.set(true);
      }
    });
  }

  diffClass() {
    const d = this.problem()?.difficulty;
    return d === 'easy' ? 'diff-easy' : d === 'medium' ? 'diff-med' : 'diff-hard';
  }

  statusInfo() {
    const s = this.result()?.status;
    if (s === 'accepted')          return { label: '✓ Accepted',        cls: 'res-ok'  };
    if (s === 'wrong_answer')      return { label: '✗ Wrong Answer',    cls: 'res-bad' };
    if (s === 'compilation_error') return { label: '⚠ Compile Error',   cls: 'res-err' };
    return                                { label: '⚠ Runtime Error',   cls: 'res-err' };
  }
}
