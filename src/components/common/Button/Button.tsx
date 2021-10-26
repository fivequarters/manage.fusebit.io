import { Button as MUIButton, ButtonProps } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const BUTTON_MODES: { [k: string]: Partial<ButtonProps> } = {
  add: {
    startIcon: <AddIcon />,
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
