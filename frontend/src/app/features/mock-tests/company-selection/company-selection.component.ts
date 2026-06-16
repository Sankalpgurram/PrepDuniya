import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface Company {
  name: string;
  id: string;
  color: string;
}

@Component({
  selector: 'app-company-selection',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule],
  templateUrl: './company-selection.component.html',
  styleUrl: './company-selection.component.css'
})
export class CompanySelectionComponent {
  companies: Company[] = [
    { name: 'Amazon', id: 'amazon', color: '#FF9900' },
    { name: 'Google', id: 'google', color: '#4285F4' },
    { name: 'Microsoft', id: 'microsoft', color: '#00A4EF' },
    { name: 'TCS', id: 'tcs', color: '#169C5C' },
    { name: 'Infosys', id: 'infosys', color: '#007CC3' }
  ];
}
