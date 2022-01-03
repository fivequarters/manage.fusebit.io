import { Button as MUIButton, ButtonProps } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const BUTTON_MODES: { [k: string]: Partial<ButtonProps> } = {
  add: {
    startIcon: <AddIcon />,
    size: 'large',
    variant: 'outlined',
    color: 'primary',
  },
  search: {
    startIcon: <SearchIcon />,
    size: 'large',
    variant: 'outlined',
    color: 'primary',
  },
};

type Variant = keyof typeof BUTTON_MODES;

const Button = ({ mode, children, ...props }: ButtonProps & { mode?: Variant }) => {
  return (
    <MUIButton size="large" variant="outlined" color="primary" {...(BUTTON_MODES[mode as Variant] || {})} {...props}>
      {children}
    </MUIButton>
  );
};

export default Button;
