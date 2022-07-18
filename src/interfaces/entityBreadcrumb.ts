export interface BreadcrumbItem {
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, isLastItem: boolean) => void;
  href?: string;
  active?: boolean;
  icon?: string;
}
