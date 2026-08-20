import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'gold', 'outline', 'text'
  size = 'md',        // 'sm', 'md', 'lg'
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
  href,
  disabled = false,
  type = 'button',
  ...props
}) => {
  const baseClass = `btn btn-${variant} ${size !== 'md' ? `btn-${size}` : ''} ${className}`.trim();

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <a href={href} className={baseClass} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={baseClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
