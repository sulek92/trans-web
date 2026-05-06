import type { FC } from 'react';

interface Props {
  initialContent: string;
  onSave: (json: any) => Promise<void>;
  saving: boolean;
}

export const OfferEditor: FC<Props> = () => {
  return null;
};
