import NavCategoryTooltip from './NavCategoryTooltip';

export const BASE_CATEGORY_TOOLTIPS = [
  {
    id: 'code',
    jsx: (
      <NavCategoryTooltip
        title="Code"
        description="All the files needed to run your Fusebit Integration as a microservice on our platform."
      />
    ),
  },
  {
    id: 'settings',
    jsx: (
      <NavCategoryTooltip
        title="Code"
        description="Configuration logic, such as CRON scheduling, for your Integration."
      />
    ),
  },
];
