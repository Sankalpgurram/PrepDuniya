import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../../../environments/environment';
import { pageAnimations, listAnimation } from '../../../shared/animations';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  animations: [pageAnimations, listAnimation]
})
export class AdminDashboardComponent implements OnInit {
  questions: any[] = [];
  questionForm: FormGroup;
  editingId: number | null = null;
  displayedColumns: string[] = ['question', 'type', 'category', 'company', 'actions'];
  private apiUrl = `${environment.apiUrl}/admin/questions`;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      type: ['technical', Validators.required],
      category: [''],
      company: [''],
      role: ['']
    });
  }

  ngOnInit(): void {
    this.fetchQuestions();
  }

  fetchQuestions() {
    this.http.get<any>(this.apiUrl).subscribe(res => {
      if (res.success) {
        this.questions = res.data;
      }
    });
  }

  saveQuestion() {
    if (this.questionForm.valid) {
      if (this.editingId) {
        this.http.put(`${this.apiUrl}/${this.editingId}`, this.questionForm.value).subscribe(() => {
          this.resetForm();
          this.fetchQuestions();
        });
      } else {
        this.http.post(this.apiUrl, this.questionForm.value).subscribe(() => {
          this.resetForm();
          this.fetchQuestions();
        });
      }
    }
  }

  editQuestion(q: any) {
    this.editingId = q.id;
    this.questionForm.patchValue(q);
  }

  deleteQuestion(id: number) {
    if (confirm('Are you sure you want to delete this question?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.fetchQuestions();
      });
    }
  }

  resetForm() {
    this.editingId = null;
    this.questionForm.reset({ type: 'technical' });
  }
}
