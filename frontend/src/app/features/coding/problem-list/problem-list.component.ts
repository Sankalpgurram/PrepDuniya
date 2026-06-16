import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { CodingService } from '../coding.service';

@Component({
  selector: 'app-problem-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonToggleModule, MatTableModule,
            MatChipsModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, FormsModule],
  templateUrl: './problem-list.component.html',
  styleUrl: './problem-list.component.css'
})
export class ProblemListComponent implements OnInit {
  allProblems: any[] = [];
  isLoading = signal(true);
  selectedDifficulty = signal<string>('all');
  searchQuery = signal('');

  displayedColumns = ['status', 'title', 'difficulty', 'tags', 'acceptance'];

  filteredProblems = computed(() => {
    const diff = this.selectedDifficulty();
    const q = this.searchQuery().toLowerCase();
    return this.allProblems
      .filter(p => diff === 'all' || p.difficulty === diff)
      .filter(p => !q || p.title.toLowerCase().includes(q));
  });

  stats = computed(() => ({
    total: this.allProblems.length,
    solved: this.allProblems.filter(p => p.solved).length,
    easy: this.allProblems.filter(p => p.difficulty === 'easy').length,
    medium: this.allProblems.filter(p => p.difficulty === 'medium').length,
    hard: this.allProblems.filter(p => p.difficulty === 'hard').length,
  }));

  constructor(private codingService: CodingService) {}

  ngOnInit() {
    this.codingService.getProblems().subscribe({
      next: (res) => {
        if (res.success) this.allProblems = res.data;
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  setDifficulty(diff: string) {
    this.selectedDifficulty.set(diff);
  }

  setSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  getDifficultyClass(diff: string) {
    return { easy: 'badge-easy', medium: 'badge-medium', hard: 'badge-hard' }[diff] || '';
  }
}
