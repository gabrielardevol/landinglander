import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgClass, NgFor, NgForOf} from '@angular/common';
import {MatButton, MatMiniFabButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {BackgroundPosition, Section} from './snippet.interface';
import {CdkCopyToClipboard} from '@angular/cdk/clipboard';
import {MatDivider} from '@angular/material/divider';
import {MatTooltip} from '@angular/material/tooltip';
import {CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray} from '@angular/cdk/drag-drop';
import {FormsModule} from '@angular/forms';
import {SectionEditableComponent} from './sectioneditable.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgForOf, NgClass, NgFor, MatMiniFabButton, CdkCopyToClipboard, MatButton, MatDivider, MatTooltip, CdkDropList, CdkDrag, FormsModule, SectionEditableComponent, CdkDropListGroup],
  styles: [
    `
      ::-webkit-scrollbar {
        width: 10px;
        position: absolute;
        right: -1rem;
      }

      ::-webkit-scrollbar-track {
        background: #ffffff;
        @apply rounded-r-full overflow-hidden
      }

      ::-webkit-scrollbar-thumb {
        background: #888;
        @apply rounded-r-full overflow-hidden
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #555;
      }

      input[type="color" i] {
        padding: 1px;
      }

      ::ng-deep #sidebar .mat-accent.mat-mdc-mini-fab {
        @apply bg-white;
        color: black;
      }

      .example-box {
        transition: box-shadow 200ms cubic-bezier(0, 0, 0.2, 1);
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0),
        0 2px 2px 0 rgba(0, 0, 0, 0.14),
        0 1px 5px 0 rgba(0, 0, 0, 0.12);
      }

      .example-box:active {
        box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
        0 8px 10px 1px rgba(0, 0, 0, 0.14),
        0 3px 14px 2px rgba(0, 0, 0, 0.12);
      }

    `
  ],
  template: `
      <div class="flex box-border bg-gray-700 p-3 gap-2 h-[100vh]">
 
          <div id="sidebar" class="button-pannel flex flex-col items-center gap-2">
              <button (click)="addSection(); onSectionChange()">
                  <i class="bi bi-plus-lg"></i>
              </button>
              <button #colorButton class="relative !text-[{{color.textColor}}] !bg-[{{color.color}}]">
                  <i class="bi bi-palette-fill"></i>
                  <input type="color" class="absolute top-[-8px] right-[-12px] w-10 h-10 opacity-0" id="body"
                         name="body"
                         value="{{color.color}}" #colorInput [(ngModel)]="color.color"
                         (ngModelChange)="onColorChange(); onSectionChange()"/>
              </button>

            <mat-divider class="w-full" [vertical]="false"/>

            <!--        <button mat-mini-fab [matTooltip]="'Download json'">-->
            <!--          <i class="bi bi-download"></i>-->
            <!--        </button>-->
            <!--        <button mat-mini-fab [matTooltip]="'Upload json'">-->
            <!--          <i class="bi bi-upload"></i>-->
            <!--        </button>-->
            <button [disabled]="historicSteps >= (historic.length - 1)" (click)="undo()">
              <i class="bi bi-arrow-90deg-left"></i>
            </button>
            <button [disabled]="historicSteps == 0" (click)="redo()">
                  <i class="bi bi-arrow-90deg-right"></i>
              </button>

              <mat-divider class="w-full" [vertical]="false"/>
              <button (click)="openSnippet(template)">
                  <i class="bi bi-code-slash"></i>
              </button>
          </div>
          <div class="flex-1 overflow-auto rounded-xl shadow-inner">
              <ng-template #template>
                  <div class="h-[50vh] flex flex-col overflow-hidden">
                      <div class="flex-1 overflow-y-auto overflow-x-hidden p-3">
                          <div>
                              {{cssSnippet}}
                              {{htmlSnippet}}
                          </div>
                      </div>
                      <button mat-button [cdkCopyToClipboard]="buildSnippet()" class="m-2 border-t border-gray-400">Copy
                          to
                          clipboard
                      </button>
                  </div>
              </ng-template>

              <div class="overflow-hidden bg-gray-200">
                  <div class="flex flex-col overflow-visible bg-white min-h-[calc(100vh-24px)]" cdkDropList
                       (cdkDropListDropped)="drop($event)">
                      <app-section-editable class="example-box" cdkDrag *ngFor="let section of sections, let i = index" [section]="section"
                                            [color]="color"
                                            [ngClass]="section[0] !== undefined ? 'flex-1 flex' : ''"
                                            (onSectionChange)="onSectionChange()"/>
                  </div>
              </div>
          </div>
      </div>
  `
  ,
})
export class AppComponent implements OnInit, OnChanges {
  codeSnippet: string = "";
  sectionCodeSnippet: string[] = [];
  color: { color: string, textColor: string } = {color: '#CA2D1C', textColor: '#ffffff'};
  @ViewChild('colorInput') colorInput!: ElementRef;
  @ViewChild('colorButton') colorButton!: MatMiniFabButton;
  historic: Section[][][] = [];
  @Input() sections: Section[][] =
    [
      [
        {
          text: "Add sections and customize its appearance using the menu options. Copy the code and use it on your website.",
          image: "",
          header: "Welcome to landing lander!",
          bright: true
        },
      ],
      [
        {
          text: "Use the color options to customize your landing",
          image: "https://img.freepik.com/premium-photo/yellow-rubber-duck-floating-pool_673414-87.jpg?w=1800",
          bright: false,
          backgroundPosition: BackgroundPosition.CENTER,
        },
        {
          text: "Combine with light and dark mode. Add your images and apply color as filter.",
          image: "https://img.freepik.com/premium-photo/yellow-rubber-duck-floating-pool_673414-87.jpg?w=1800",
          bright: true,
          backgroundPosition: BackgroundPosition.CENTER,
        },
      ],
      [
        {
          text: "Use the color options to customize your landing",
          image: "https://img.freepik.com/premium-photo/yellow-rubber-duck-floating-pool_673414-87.jpg?w=1800",
          bright: false,
          backgroundPosition: BackgroundPosition.CENTER,
          colored: {textColor: "#000000", color: "#000000"}
        },
        {
          text: "Combine with light and dark mode. Add your images and apply color as filter.",
          image: "https://img.freepik.com/premium-photo/yellow-rubber-duck-floating-pool_673414-87.jpg?w=1800",
          bright: true,
          backgroundPosition: BackgroundPosition.CENTER,
          colored: {textColor: "#000000", color: "#000000"}
        },
      ]
    ]

  cssSnippet: string = "";
  htmlSnippet: string = "";
  historicSteps: number = 1;

  constructor(
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.onSectionChange()
  }

  ngOnChanges(changes: SimpleChanges) {
    this.buildSnippet()
  }

  onColorChange() {
    const color = this.color.color.replace("#", "");
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const luminosidad = 0.299 * r + 0.587 * g + 0.114 * b;
    luminosidad > 128 ? this.color.textColor = "#000000" : this.color.textColor = "#ffffff";
    return luminosidad > 128;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
  }

  openSnippet(templateRef: any) {
    this.buildSnippet()
    let dialogRef = this.dialog.open(templateRef, {});

  }

  buildSnippet() {
    this.htmlSnippet = "";
    this.cssSnippet = "";
    this.cssSnippet =
      "<style>" +
        "* {box-sizing: border-box}" +
        "h1, p {" +
        "padding: 0;" +
        "margin: 0;" +
        "width: 100%;" +
        "}" +
        ".snippet--section {" +
        "min-height: 300px;" +
        "display: flex;" +
        "flex: 1;" +
        "}" +
        ".snippet--section.double {" +
        ".snippet--content {" +
        "max-width: 600px;" +
        "}" +
        ".snippet--part:first-child {" +
        "display: flex;" +
        "justify-content: end" +
        "}" +
        "}" +
        ".snippet--section:not(.double){" +
        ".snippet--part {" +
        "display: flex;" +
        "justify-content: center" +
        "}" +
        ".snippet--content {" +
        "max-width: 1200px;" +
        "margin: auto;" +
        "padding: 24px" +
        "}" +
        "}" +
        ".snippet--part {" +
        "flex: 1;" +
        "position: relative;" +
      "background: white;" +
        "}" +
        ".snippet--part--bgimage {" +
        "position: absolute;" +
        "width: 100%;" +
        "height: 100%;" +
        "background-size: cover" +
        "}" +
        ".snippet--content {" +
        "position: absolute;" +
        "width: 100%;" +
        "height: 100%;" +
        "z-index: 10;" +
        "display: flex;" +
        "flex-flow: column;" +
        "align-items: center;" +
        "justify-content: center;" +
        "padding: 24px;" +
        "}" +
        ".snippet--part--bgdark {" +
      "background: #00000063;" +
      "position: absolute;" +
      "width: 100%;" +
      "height: 100%;" +
      "}" +
      ".snippet--part--bgbright {" +
      "background: #ffffff91;" +
      "position: absolute;" +
      "width: 100%;" +
      "height: 100%;" +
      "}" +
      ".snippet--part--bgcolor {" +
      "position: absolute;" +
      "width: 100%;" +
      "height: 100%;" +
      "mix-blend-mode: screen;" +
      "z-index: 10;" +
      "pointer-events: none;" +
      "background-color: " + this.color.color +
      "}" +
        " </style>"

    this.htmlSnippet += '<div style="min-height: 100vh; display: flex; flex-flow: column">';
    this.sections.forEach((section, i) => {
      this.htmlSnippet += '<div class="snippet--section' + (section.length == 2 ? ' double' : '') + '">';
      section.forEach((part, i) => {
        this.htmlSnippet +=
          '<div class="snippet--part">' +
          '<div class="snippet--content" ' +
          'style="text-align: '+ (part.textAlign == 'left' ? 'start' : part.textAlign == 'right' ? 'end' : 'center') +'; ' +
          'color: ' + ( part.bright ? 'black' : 'white' ) +
          '">' +
          '<h1>' +
          (part.header ? part.header : '') +
          '</h1>' +
          '<p>' +
          (part.text ? part.text : '') +
          '</p>' +
          '</div>' +
          '<div class="snippet--part--bgimage" style="background-image: url(' + part.image + ');' +
          (part.colored ? 'filter: saturate(0);' : '') +
          '"></div>' +
          (!(part.image && !part.text) || !(!part.image && part.text) ? part.bright == false ? '<div class="snippet--part--bgdark"></div>' : '<div class="snippet--part--bgbright"></div>' : '') +
          (part.colored ? '<div class="snippet--part--bgcolor"></div>' : '') +
          '</div>'
      })
      this.htmlSnippet += '</div>'
    })
    this.htmlSnippet += '</div>';
    return this.cssSnippet + this.htmlSnippet
  }

  addSection() {
    this.sections.push(
      [
        {
          image: "",
          text: "lorem ipsum",
          bright: true
        }
      ]
    )
  }

  onSectionChange() {
    for (let i = 0; i < this.historicSteps; i++) {
      this.historic.pop()
    }
    this.historicSteps = 0;
    let sections = JSON.parse(JSON.stringify(this.sections))
    this.historic = [...this.historic, sections]
  }

  undo(){
    this.historicSteps += 1;
    this.historicSteps >= this.historic.length ? console.log("no more undo steps") : null
    this.sections = JSON.parse(JSON.stringify(this.historic[this.historic.length - this.historicSteps - 1]))
  }

  redo() {
    this.historicSteps == 0 ? console.log("no more undo steps") : null
    this.sections = JSON.parse(JSON.stringify(this.historic[this.historic.length - this.historicSteps]))
    this.historicSteps -= 1;
  }
}
