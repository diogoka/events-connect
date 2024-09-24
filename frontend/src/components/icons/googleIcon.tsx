import React from 'react';

type Props = {
  name: string;
  size: number;
  outlined?: boolean;
  weight?: number;
};

const GoogleIcon = ({ name, size, outlined = false, weight = 400 }: Props) => {
  return (
    <span
      className={outlined ? 'material-symbols-outlined' : 'material-icons'}
      style={{
        fontSize: `${size}px`,
        fontWeight: `${weight}`,
      }}
    >
      {name}
    </span>
  );
};

export default GoogleIcon;
