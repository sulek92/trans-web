import type { FC } from 'react';

interface Props {
  initialContent: string;
  onSave: (json: any) => Promise<void>;
  saving: boolean;
}

export const ContactEditor: FC<Props> = () => {
  return null;
};
