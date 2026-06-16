import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InterviewService } from '../../../core/services/interview.service';

interface ChatMessage {
  role: 'ai' | 'user';
  text: string;
}

@Component({
  selector: 'app-hr-interview',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './hr-interview.component.html',
  styleUrl: './hr-interview.component.css'
})
export class HrInterviewComponent implements OnInit, OnDestroy {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  company: string = '';
  role: string = 'Software Engineer';
  
  chatHistory: ChatMessage[] = [];
  questions: string[] = [];
  answers: string[] = [];
  
  userInputBox: string = '';
  isRecording: boolean = false;
  isAiThinking: boolean = true;
  isEvaluating: boolean = false;
  
  recognition: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private interviewService: InterviewService
  ) {}

  ngOnInit(): void {
    this.company = this.route.snapshot.paramMap.get('company') || '';
    this.setupSpeechRecognition();
    if (this.company) {
      this.startHrSession();
    }
  }

  ngOnDestroy(): void {
    window.speechSynthesis.cancel();
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  setupSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.userInputBox += (this.userInputBox ? ' ' : '') + transcript;
      };

      this.recognition.onend = () => {
        this.isRecording = false;
      };
    } else {
      console.warn("Speech recognition not supported in this browser.");
    }
  }

  startHrSession() {
    this.isAiThinking = true;
    this.interviewService.startInterview(this.company, this.role, 'hr').subscribe({
      next: (res) => {
        this.isAiThinking = false;
        if (res.success && res.data && res.data.questions && res.data.questions.length > 0) {
          const firstQuestion = res.data.questions[0];
          this.addMessageAndSpeak('ai', firstQuestion);
          this.questions.push(firstQuestion);
        }
      },
      error: () => this.isAiThinking = false
    });
  }

  toggleRecording() {
    if (!this.recognition) return;
    
    if (this.isRecording) {
      this.recognition.stop();
    } else {
      window.speechSynthesis.cancel(); // Stop AI speaking if user interrupts
      this.isRecording = true;
      this.userInputBox = '';
      this.recognition.start();
    }
  }

  addMessageAndSpeak(role: 'ai' | 'user', text: string) {
    this.chatHistory.push({ role, text });
    this.scrollToBottom();

    if (role === 'ai') {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; 
      window.speechSynthesis.speak(utterance);
    }
  }

  sendAnswer() {
    if (!this.userInputBox.trim()) return;

    const answer = this.userInputBox.trim();
    this.userInputBox = '';
    this.answers.push(answer);
    this.addMessageAndSpeak('user', answer);

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    if (this.questions.length >= 5) {
      // Auto-submit after 5 interactions
      this.submitInterview();
      return;
    }

    this.isAiThinking = true;
    const previous_q = this.questions[this.questions.length - 1];

    this.interviewService.nextQuestion(previous_q, answer, this.company, this.role).subscribe({
      next: (res) => {
        this.isAiThinking = false;
        if (res.success && res.data) {
          const nextQ = res.data.next_question || "Could you elaborate on your experience?";
          this.questions.push(nextQ);
          this.addMessageAndSpeak('ai', nextQ);
        }
      },
      error: () => {
        this.isAiThinking = false;
        this.addMessageAndSpeak('ai', "I apologize, let's move on. Can you share why you want to join us?");
        this.questions.push("Can you share why you want to join us?");
      }
    });
  }

  submitInterview() {
    this.isEvaluating = true;
    window.speechSynthesis.cancel();

    this.interviewService.submitInterview(this.questions, this.answers, this.company, this.role, 'hr').subscribe({
      next: (res) => {
        this.isEvaluating = false;
        if (res.success) {
          this.router.navigate(['/mock-tests/result'], { state: { result: res.data } });
        }
      },
      error: (err) => {
        this.isEvaluating = false;
        console.error("Evaluation Failed", err);
      }
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch(err) {}
    }, 100);
  }
}
