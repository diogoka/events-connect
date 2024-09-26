import React from 'react';

type Props = {
  name: string;
  size: number;
  outlined?: boolean;
  weight?: number;
  color?: string;
};

const GoogleIcon = ({
  name,
  size,
  outlined = false,
  weight = 400,
  color,
}: Props) => {
  return (
    <span
      className={outlined ? 'material-symbols-outlined' : 'material-icons'}
      style={{
        fontSize: `${size}px`,
        fontWeight: `${weight}`,
        color: color ? color : 'inherit',
      }}
    >
      {name}
    </span>
  );
};

export default GoogleIcon;
