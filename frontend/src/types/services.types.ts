export type checkedIdResponse = {
  checked: boolean;
  code: number;
  message?: string;
};

export type UseUploadImageType = {
  image: File | null;
  warning: string;
  onFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
