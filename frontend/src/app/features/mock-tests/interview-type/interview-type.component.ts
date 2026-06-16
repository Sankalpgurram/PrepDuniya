import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-interview-type',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './interview-type.component.html',
  styleUrl: './interview-type.component.css'
})
export class InterviewTypeComponent implements OnInit {
  companyId: string = '';
  companyName: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.companyId = params.get('company') || '';
      this.companyName = this.companyId.charAt(0).toUpperCase() + this.companyId.slice(1);
    });
  }
}
