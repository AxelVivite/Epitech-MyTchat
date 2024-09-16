import React, { ReactElement } from 'react';

export interface View {
    path: string;
    component: React.FC<ReactElement<unknown, string> | null>;
    // options?: DrawerViewOptions | TabViewOptions | StackViewOptions;
  }
