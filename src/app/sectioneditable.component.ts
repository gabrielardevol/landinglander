import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {BackgroundPosition, Section} from './snippet.interface';
import {MatButton, MatIconButton, MatMiniFabButton} from '@angular/material/button';
import {MatDialog, MatDialogClose} from '@angular/material/dialog';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {CdkCopyToClipboard} from '@angular/cdk/clipboard';
import {CdkDragHandle} from '@angular/cdk/drag-drop';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-section-editable',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    MatMiniFabButton,
    MatButton,
    MatDialogClose,
    MatFormField,
    MatInput,
    CdkCopyToClipboard,
    MatIconButton,
    CdkDragHandle,
    MatTooltip,
  ],
  styles: [
    `
      ::ng-deep .mat-accent.mat-mdc-mini-fab {
        @apply bg-gray-200 text-black;
      }

      ::ng-deep .mat-accent.mat-mdc-mini-fab:hover {
        @apply bg-[#292929] text-white;
      }

      ::ng-deep .selected.mat-accent.mat-mdc-mini-fab {
        @apply text-white;
        background-color: #4e4e4e;
      }

      #section:hover .cdkDragHandle {
        display: block;
        pointer-events: visibleFill;
      }

      .section-part:hover button:not(.hidden) {
        @apply block;
      }

      .button-pannel button {
        @apply relative hidden;
        z-index: 11;
      }

      p:focus-visible, h1:focus-visible {
        outline: transparent;
      }

      #image-buttons.selected:hover .hidden {
        display: block;
      }

      #text-buttons:hover .hidden {
        display: block;
      }

      /*.colored-bg {*/
      /*  filter: saturate(0) contrast(1.8) brightness(3.5);*/
      /*}*/

    `
  ],
  template: `
      <div id="section" class="relative flex flex-1 flex-col sm:flex-row section">
          <button #cdkDragButton
                  class="cdkDragHandle m-auto hidden w-full top-[-10px] justify-center absolute h-min z-20 ">
              <i cdkDragHandle class="bi bi-grip-horizontal text-4xl text-stone-400 m-[-1px] "></i>
              <i cdkDragHandle class="bi bi-grip-horizontal text-4xl text-stone-400 m-[-1px]"></i>
              <i cdkDragHandle class="bi bi-grip-horizontal text-4xl text-stone-400 m-[-1px]"></i>
          </button>
          <div *ngFor="let part of section, let i = index"
               class="min-h-[300px] flex-1 flex relative section-part"
               [ngClass]="[section[i + 1] ? 'justify-end' : ( section[i - 1] ? 'justify-start' : 'justify-center')]">
              <ng-template #imagePopup>
                  <div class="p-3 flex flex-col">
                      <mat-form-field>
                          <label for="image">Input image URL</label>
                          <div class="flex">
                              <input id="image" #imageInput matInput type="text"
                                     [value]="part.image ? part.image : ''">
                              <button mat-icon-button *ngIf="part.image" (click)="part.image = undefined">
                                  <i class="bi bi-trash-fill"></i>
                              </button>
                              <button mat-icon-button *ngIf="!part.image" (click)="pasteFromClipboard(i)">
                                  <i class="bi bi-clipboard"></i>
                              </button>
                          </div>

                      </mat-form-field>

                      <button mat-flat-button (click)="setImage(i); onSectionChange.emit()" mat-dialog-close>Set image</button>
                      <button *ngIf="part.image" mat-button [cdkCopyToClipboard]="part.image"
                              mat-dialog-close>
                          Copy to clipboard
                      </button>
                  </div>
              </ng-template>

              <div #textContent class="p-6 w-full items-center flex z-10 flex-col justify-center"
                   [ngClass]="[
                   part.textAlign ? 'text-' + part.textAlign : 'text-center' ,
                   section.length === 2 ? 'max-w-[' + MAX_WIDTH / 2 + 'px]' : 'max-w-[' + MAX_WIDTH + 'px]',
                    part.bright != false && !part.image ? 'text-black' :
                     part.image && part.bright != false ? 'text-black' :
                     part.image && part.bright == false ? 'text-white' : 'text-white'
             ]">

                  <h1 *ngIf="section[i].header" class="w-full text-xl" spellcheck="false"
                      contenteditable="true"
                      (input)="onTextChange($event.target, i, 'headers')">{{part.header}}</h1>

                  <p *ngIf="section[i].text" class="w-full " spellcheck="false" contenteditable="true"
                     (input)="onTextChange($event.target, i, 'text')">{{part.text}}</p>
              </div>
              <div #imageBackground
                   style="background-image: url({{part.image}}); "
                   class=" absolute h-full w-full bg-cover bg-{{part.backgroundPosition}}"
                   [ngClass]="[part.colored ? 'saturate-0' : '', part.bright ? 'bg-white' : part.bright == false ? 'bg-black' : 'bg-white' ]"
              ></div>
              <div #darkBackground *ngIf="part.bright == false && (part.text || part.header)"
                   class="absolute h-full w-full bg-[#00000063]"></div>
              <div #brightBackground *ngIf="part.bright != false && (part.text || part.header)"
                   class="absolute h-full w-full bg-[#ffffff91]"></div>

              <div #coloredBackground *ngIf="part.colored"
                   class=" absolute pointer-events-none h-full w-full z-40 mix-blend-screen bg-[{{color.color}}]"></div>
              <div #buttons class="button-pannel absolute flex flex-col top-0 left-0 gap-3 p-3 items-start z-[50]">
                  <div class="flex flex-col gap-3">

                      <div id="text-buttons" class="flex gap-3" [ngClass]="part.text ? 'selected' : ''">
                          <button mat-mini-fab (click)="addText(i); onSectionChange.emit()"
                                  [ngClass]="part.text ? 'selected' : ''">
                              <i class="bi bi-type"></i>
                          </button>
                          <button mat-mini-fab (click)="addHeader(i); onSectionChange.emit()"
                                  [ngClass]="part.header ? 'selected' : ''" class="hidden">
                              <i class="bi bi-type-h1"></i>
                          </button>
                          <button mat-mini-fab class="hidden" (click)="(part.textAlign = 'center'); onSectionChange.emit()"
                                  [ngClass]="part.textAlign == 'center' || !part.textAlign ? 'selected' : ''">
                              <i class="bi bi-text-center"></i>
                          </button>
                          <button mat-mini-fab class="hidden" (click)="(part.textAlign = 'left'); onSectionChange.emit()"
                                  [ngClass]="part.textAlign == 'left' ? 'selected' : ''">
                              <i class="bi bi-text-left"></i>
                          </button>
                          <button mat-mini-fab class="hidden" (click)="(part.textAlign = 'right'); onSectionChange.emit()"
                                  [ngClass]="part.textAlign == 'right' ? 'selected' : ''">
                              <i class="bi bi-text-right"></i>
                          </button>
                      </div>
                      <div id="image-buttons" class="flex gap-3" [ngClass]="part.image ? 'selected' : ''">
                          <button mat-mini-fab (click)="openModal(imagePopup)"
                                  [ngClass]="part.image ? 'selected' : ''">
                              <i class="bi bi-image"></i>
                          </button>
                          <button
                                  *ngFor="let position of [BackgroundPosition.BOTTOM, BackgroundPosition.RIGHT, BackgroundPosition.LEFT, BackgroundPosition.TOP]"
                                  mat-mini-fab class="hidden" (click)="part.backgroundPosition = position"
                                  [ngClass]="part.backgroundPosition === position ? 'selected' : ''">
                              <i *ngIf="position == BackgroundPosition.BOTTOM || position == BackgroundPosition.TOP"
                                 class="bi bi-align-{{position}}"></i>
                              <i *ngIf=" position == BackgroundPosition.RIGHT" class="bi bi-align-end"></i>
                              <i *ngIf="position == BackgroundPosition.LEFT" class="bi bi-align-start"></i>

                          </button>

                          <!--              <button mat-mini-fab class="hidden" (click)="part.grayScale ? part.grayScale = false : part.grayScale = true">-->
                          <!--                <i class="bi bi-circle-half"></i>-->
                          <!--              </button>-->
                      </div>

                      <button *ngIf="section.length == 1" [disabled]="section[1]" mat-mini-fab (click)="addItem(i); onSectionChange.emit()">
                          <i class="bi bi-layout-split"></i>
                      </button>
                      <button mat-mini-fab (click)="deleteItem(i); onSectionChange.emit()">
                          <i class="bi bi-trash-fill"></i>
                      </button>
                  </div>

                  <button mat-mini-fab (click)="applyColor(i); onSectionChange.emit()" [ngClass]="part.colored ? 'selected' : ''">
                      <i class="bi bi-palette-fill"></i>
                  </button>
                  <button mat-mini-fab (click)="part.bright ? part.bright = !part.bright : part.bright = true; onSectionChange.emit()">
                      <i *ngIf="!part.bright" class="bi bi-brightness-high-fill"></i>
                      <i *ngIf="part.bright" class="bi bi-moon-fill"></i>
                  </button>
              </div>
          </div>
      </div>
  `,

})
export class SectionEditableComponent implements OnInit, OnChanges {

  @Input() section: Section[] = [{
    image: undefined,
    text: undefined,
    header: undefined,
    backgroundPosition: undefined
  }];
  MAX_WIDTH: number = 1200;
  @Input() color: { color: string, textColor: string } = {color: "", textColor: ""};
  text: (string | undefined)[] = [];
  headers: (string | undefined)[] = [];
  @ViewChild('imageInput') imageInput!: ElementRef;
  @Output() onSectionChange  = new EventEmitter<void>();
  emptySection: Section = {
    text: 'Click to edit text. Navigate the buttons to modify the visual appearance of this section. Use the upper grip to sort the sections.',
    header: 'Click to edit header.',
    bright: true
  };

  constructor(
    public dialog: MatDialog
  ) {
  }

  async pasteFromClipboard(i: number) {
    try {
      const text = await navigator.clipboard.readText();
      this.section[i].image = text;
    } catch (err) {
      console.error('Error al leer el portapapeles: ', err);
    }
  }

  ngOnInit() {
    this.text[0] = this.section[0]?.text;
    this.text[1] = this.section[1]?.text;
  }

  ngOnChanges() {
    console.log("changes")
  }
  deleteItem(i: number) {
    this.section.splice(i, 1)
  }

  addHeader(i: number) {
    this.section[i].header ? this.section[i].header = undefined : this.section[i].header = "lorem ipsum dolor sit amet"
  }

  openModal(templateRef: any) {
    let dialogRef = this.dialog.open(templateRef, {});
  }

  setImage(i: number) {
    if (this.imageInput) this.section[i].image = this.imageInput.nativeElement.value;
  }

  onTextChange(innerHTML: any, i: number, type: 'text' | 'headers') {
    if (i === 0) this[type][0] = innerHTML.innerText;
    if (i === 1) this[type][1] = innerHTML.innerText;
  }

  addText(i: number) {
    this.section[i].text ? this.section[i].text = undefined : this.section[i].text = "lorem ipsum dolor sit amet"
  }

  addItem(i: number) {
    this.section.push(this.emptySection)
  }

  applyColor(i: number) {
    this.section[i].colored ? this.section[i].colored = undefined : this.section[i].colored = this.color
  }

  protected readonly BackgroundPosition = BackgroundPosition;
}
