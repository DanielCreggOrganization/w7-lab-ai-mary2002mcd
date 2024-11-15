import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, 
         IonGrid, IonRow, IonCol, IonCard, IonCardContent, 
         IonCardHeader, IonCardTitle, IonItem, IonLabel, 
         IonButton, IonIcon, IonProgressBar, IonText,
         IonRadioGroup, IonRadio, IonImg, IonTextarea,
         IonRippleEffect } from '@ionic/angular/standalone';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';
// Add to imports
import { GeminiAiService } from '../services/gemini-ai.service';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [
    // TODO: Add all the Ionic components from the imports above
    // HINT: Copy each component name from the imports list
    CommonModule, 
    FormsModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, 
         IonGrid, IonRow, IonCol, IonCard, IonCardContent, 
         IonCardHeader, IonCardTitle, IonItem, IonLabel, 
         IonButton, IonIcon, IonProgressBar, IonText,
         IonRadioGroup, IonRadio, IonImg, IonTextarea,
         IonRippleEffect
    // YOUR CODE HERE
  ]
})
export class HomePage {
  // TODO: Add default prompt
  // HINT: Something like "Provide a recipe for these baked goods"
  prompt = 'Provide a recipe for these baked goods'; 
  output = '';
  isLoading = false;

  selectedModel = 'gemini-1.5-flash';

  availableImages = [
    { url: 'assets/images/baked_goods_1.jpeg', label: 'Baked Good 1' },
    { url: 'assets/images/baked_goods_2.jpeg', label: 'Baked Good 2' },
    { url: 'assets/images/baked_goods_3.jpeg', label: 'Baked Good 3' },
    { url: 'assets/images/baked_goods_4.jpeg', label: 'Baked Good 4' },
    { url: 'assets/images/baked_goods_5.jpeg', label: 'Baked Good 5' },
    { url: 'assets/images/baked_goods_6.jpeg', label: 'Baked Good 6' }
  ];

  selectedImage = this.availableImages[0].url;

  // Add constructor
  constructor(private geminiService: GeminiAiService, private loadingController: LoadingController, private alertController: AlertController) {}

  get formattedOutput() {
    return this.output.replace(/\n/g, '<br>');
  }

  selectImage(url: string) {
    // TODO: Set the selectedImage property
    // HINT: this.selectedImage = url;
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async onSubmit() {
    if (this.isLoading) return;
    this.isLoading = true;

    const loading = await this.loadingController.create({
      message: 'Generating recipe...',
      spinner: 'circles',
    });
    await loading.present();
    
    try {
      // TODO: Use service methods
      // HINT:
      const base64Image = await this.geminiService.getImageAsBase64(this.selectedImage);
      this.output = await this.geminiService.generateRecipe(base64Image, this.prompt, this.selectedModel);
      
    } catch (e) {
      this.output = `Error: ${e instanceof Error ? e.message : 'Something went wrong'}`;
      await this.showErrorAlert(this.output);
    }
    
    this.isLoading = false;
    await loading.dismiss();
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.output).then(
      () => {
        console.log("Recipe copied to clipboard!");
      },
      (error) => {
        console.error("Failed to copy recipe:", error);
      }
    );
  }
}