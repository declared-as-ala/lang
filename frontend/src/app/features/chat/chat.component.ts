import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatMessage } from './chat.model';
import { ChatService } from './chat.service';
import { MarkdownPipe } from '../../shared/pipes/markdown.pipe';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MarkdownPipe],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  
  chatForm: FormGroup;
  messages: ChatMessage[] = [];
  isLoading = false;
  
  constructor(
    private fb: FormBuilder,
    private chatService: ChatService
  ) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required]]
    });
    
    this.messages.push({
      id: '0',
      role: 'assistant',
      content: 'Hello! I\'m your language learning assistant. How can I help you today?',
      timestamp: new Date()
    });
  }
  
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  
  sendMessage() {
    if (this.chatForm.invalid || this.isLoading) return;
    
    const userMessage = this.chatForm.value.message;
    
    // Add user message
    this.messages.push({
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });
    
    this.chatForm.reset();
    this.isLoading = true;
    
    // Prepare chat history
    const chatHistory = this.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    this.chatService.sendMessage(chatHistory).subscribe({
      next: (response) => {
        const assistantMessage = response.choices[0].message.content;
        this.messages.push({
          id: response.id,
          role: 'assistant',
          content: assistantMessage,
          timestamp: new Date()
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Chat error:', err);
        this.isLoading = false;
        this.messages.push({
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, I couldn\'t process your message. Please try again.',
          timestamp: new Date(),
          isError: true
        });
      }
    });
  }
  
  private scrollToBottom() {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }
}