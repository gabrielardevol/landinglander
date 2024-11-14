export interface CodeSnippetEvent {
  snippet: string; // o el tipo que sea adecuado para el 'snippet'
  index: number;
}

export interface Section {
  image?: string | undefined;
  text?: string | undefined;
  header?: string | undefined;
  backgroundPosition?: BackgroundPosition;
  colored?: {color: string, textColor: string};
  // grayScale?: boolean;
  textAlign?: 'left' | 'right' | 'center' | undefined;
  bright?: boolean;
  // sections?: Section[];
}


export enum BackgroundPosition {
  TOP = "top",
  CENTER = "center",
  BOTTOM = "bottom",
  LEFT = "left",
  RIGHT = "right",
};

