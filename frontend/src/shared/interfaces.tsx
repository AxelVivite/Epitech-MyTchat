export interface View {
    path: string;
    component: React.FC<any>;
    //options?: DrawerViewOptions | TabViewOptions | StackViewOptions;
  }