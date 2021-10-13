export interface DrawerLink {
  text: string;
  href: string;
}

export interface Props {
  links: DrawerLink[];
  children: React.ReactNode;
}
