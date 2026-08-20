import React from 'react';
import * as Icons from 'lucide-react';

export const Icon = ({ name, size = 20, color = 'currentColor', className = '', ...props }) => {
  const Component = Icons[name] || Icons.Sparkles;
  return <Component size={size} color={color} className={className} {...props} />;
};

export default Icon;
