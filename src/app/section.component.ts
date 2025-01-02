import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  ViewChild,
  ElementRef,
  HostListener, Directive, AfterViewInit
} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {MatButton, MatMiniFabButton} from '@angular/material/button';
import {CodeSnippetEvent, Section} from './snippet.interface';
import {MatDialog, MatDialogClose} from '@angular/material/dialog';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {CdkCopyToClipboard} from '@angular/cdk/clipboard';
import {SectionEditableComponent} from './sectioneditable.component';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    NgIf,
    MatButton,
    MatMiniFabButton,
    NgForOf,
    MatFormField,
    MatInput,
    MatDialogClose,
    ReactiveFormsModule,
    CdkCopyToClipboard,
    SectionEditableComponent
  ],
  // templateUrl: './app.component.html',
  styles: [
    `
      ::ng-deep .mat-accent.mat-mdc-mini-fab {
        @apply bg-gray-200;
        color: black;
      }

      ::ng-deep .mat-accent.mat-mdc-mini-fab:hover {
        @apply bg-[#666666];
        color: white;
      }

      .section {
        @apply h-full;
        min-height: 300px;
        background: white;
      }

      .section > div {
        @apply flex-1 flex bg-cover;

      }


      .section > div:hover {
        outline: 4px dashed #bfbfbf;
        outline-offset: -4px;

      }

      .button-pannel button {
        @apply hidden;
        z-index: 11;
        position: relative;
      }

      .section > div:hover button {
        @apply block;
      }

      .section main {
        @apply flex items-center justify-center w-full
      }

      .black-bg main {
        color: white;
        z-index: 10;
      }

      .black-bg::before {
        @apply absolute top-0 right-0 w-full h-full;
        background: rgba(0, 0, 0, 0.47);
        content: "";
        z-index: 0;
      }

      /*.black-bg {*/
      /*  pointer-events: none;*/
      /*}*/

      .black-bg p {
        position: relative;
        z-index: 10;
      }

      main {
        @apply p-3;
      }

      h1 {
        @apply text-3xl
      }
      h2 {
        @apply text-2xl
      }

    input:focus-visible {
      color: black; outline: none!important; border: none!important;
    }

    textarea {
      width: 100%; height: 100%; background: transparent; border: none; outline: none; text-align: center; display: flex; align-content: center;
    }
    `
  ],
  template: `
      <div *ngIf="sections" id="section" class="relative flex flex-1 flex-col sm:flex-row section min-h-full">


          <div *ngFor="sections of sections, let i = index"
               class="flex-1 flex relative bg-{{sections[i].backgroundPosition}}"
               style="background-image: url({{sections[i].image}}); "
               [ngClass]="[ sections[i].text && sections[i].image ? 'black-bg' : '', isDouble() ? (i === 0 ? 'justify-end' : 'justify-start') :  'justify-center']"
          >
              <ng-template #image>
                  <div class="p-3 flex flex-col">
                      <mat-form-field>
                          <label for="image">Input image URL</label>
                          <input id="image" #imageInput matInput type="text" [value]="sections?[i]['image']">
                      </mat-form-field>
                      <button *ngIf="sections[i].image" mat-button [cdkCopyToClipboard]="sections?[i]['image']"
                              mat-dialog-close>
                          Copy link
                      </button>
                      <button mat-flat-button (click)="setImage(i)" mat-dialog-close>Set image</button>

                  </div>
              </ng-template>
              <div class="button-pannel absolute flex flex-col top-0 left-0 gap-1 p-3 items-start">
                  <div class="flex gap-1">
                      <!--            <button mat-mini-fab (click)="hidePart(0)">-->
                      <!--              <i class="bi bi-layout-split"></i>-->
                      <!--            </button>-->
                      <button (click)="editText[i] = !editText[i]">
                          <i class="bi bi-type"></i>
                      </button>
                      <button (click)="addHeader(i)">
                          <i class="bi bi-type-h1"></i>
                      </button>
                      <button (click)="openModal(image)">
                          <i class="bi bi-image"></i>
                      </button>

                      <button (click)="deleteItem(i)">
                          <i class="bi bi-trash-fill"></i>
                      </button>
                  </div>

                  <div class="flex gap-1">
                      <button (click)="positionImage(i, 'bottom')">
                          <i class="bi bi-align-bottom"></i>
                      </button>
                      <button (click)="positionImage(i, 'left')">
                          <i class="bi bi-align-start"></i>
                      </button>
                      <button (click)="positionImage(i, 'right')">
                          <i class="bi bi-align-end"></i>
                      </button>
                      <button (click)="positionImage(i, 'top')">
                          <i class="bi bi-align-top"></i>
                      </button>
                  </div>

                  <div class="flex gap-1">
                      <button>
                          <i class="bi bi-text-center"></i>
                      </button>
                      <button>
                          <i class="bi bi-text-left"></i>
                      </button>
                      <button>
                          <i class="bi bi-text-right"></i>
                      </button>
                  </div>
              </div>


              <main class="cursor-text flex flex-col"
                    [ngClass]="isDouble() ? 'max-w-[' + MAX_WIDTH / 2 + 'px]' : 'max-w-[' + MAX_WIDTH + 'px]'">
                  <!--                  <span contenteditable="true" *ngIf="!editText[i]" class="">{{section[i]?.text}}</span>-->
                  <!--                <h1 *ngIf="index === 0 && section[0]?.header" contenteditable="true">{{section[0]?.header}}</h1>-->
                  <!--                <h1 *ngIf="index === 1 && section[1]?.header" contenteditable="true">{{section[1]?.header}}</h1>-->

                  <p class="hidden">{{sections ? [i]['text'] : ''}}</p>
                  <p class="" contenteditable="true">hjjygvjh</p>
                  <app-section-editable></app-section-editable>

              </main>

          </div>

      </div>
      <p class="" contenteditable="true">yjtryj</p>

  `,

})
export class SectionComponent implements OnInit, AfterViewInit {

  MAX_WIDTH: number = 1200;
  editText: boolean[] = [false];
  @Input() sections: Section[] = [];
  @Input() index: number = 0;
  @Output() codeSnippet = new EventEmitter<CodeSnippetEvent>();
  @Output() deleteSection = new EventEmitter<number>();
  @ViewChild('imageInput') imageInput!: ElementRef ;

  // ({content: string | undefined, image: string | undefined} | undefined)[] | undefined
  @Directive({
    selector: '[fueraClick]'
  })
  stringifiedObject: string = "";
  sectionCount: 1 | 2 = 2;

  constructor(
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {

  }
  ngOnChanges() {
    this.updateSnippet()

  }

  hidePart(index: number) {

  }

  openModal(templateRef: any) {

    let dialogRef = this.dialog.open(templateRef, {});
  }


  positionImage(index: number, value: string) {
    this.sections?[index]['backgroundPosition'] = value;
    this.updateSnippet()
  }

  isDouble() {
    if (this.sections?[0] && this.sections?[1]) {
      return true;
    } else {
      return false
    }
  }

  updateSnippet() {
    let snippet = "<div style='height: 100%; flex: 1; display: flex; flex-flow: row'>";
    // this.section.forEach((item: Section) => {
    if (this.sections != undefined) {
      for (let i = 0; i < this.sections.length; i++) {
        let background = "";
        let justifyContent;
        this.isDouble() ? (i == 0 ? justifyContent = "right" : justifyContent = "left") : justifyContent = "center";
        let width;
        this.isDouble() ? width = this.MAX_WIDTH / 2 : width = this.MAX_WIDTH
        if (this.sections[i].text && this.sections[i].image) background = "black-bg";
        snippet += "<div class='" + background + "' " +
          "style='display: flex; padding: 20px; flex: 1; background-size: cover; background-image:"
          + " url(" + this.sections[i]["image"] + "); background-position: "
          + this.sections[i]["backgroundPosition"] + "; " +
          "justify-content: " + justifyContent + ";'> "
        if (this.sections[i].text) snippet += '<p ' +
          'style="width: 100%; margin: 0; ' +
          'display: flex; align-items: center;' +

          'max-width:' + width + 'px ">'
          + this.sections[i].text + '</p>';
        snippet += "</div>"
      }

    }

    // })
    snippet += "</div>"
    console.log(snippet)
    this.codeSnippet.emit({snippet: snippet, index: this.index})

  }

  deleteItem(i: number) {

    this.isDouble() ? this.sections?[i] = undefined :  this.deleteSection.emit(this.index);

  }

  setImage(i: number) {
    console.log(this.imageInput)
    let value;
    if (this.imageInput) value = this.imageInput.nativeElement.value;
    console.log(value)
    this.sections?[i]['image'] = value;
    // this.section[i].image = this.imageInput;
  }

  addHeader(i: number) {
  //
  //   if (this.sections[i]['header']) {
  //     this.sections[i]['header'] = undefined
  //   } else {
  //     this.sections[i]['header'] = "lorem ipsum"
  //   }
  }

}
