import logoStatus from '../assets/images/logo-status.png'
import logoStatusFooter from '../assets/images/logo-status-footer.png'

export default function BrandLogo({ className = '', variant = 'default', alt = 'STATVS Outdoor Furniture Specialists', ...props }) {
  const classes = ['brand-logo', className].filter(Boolean).join(' ')

  return (
    <img
      className={classes}
      src={variant === 'footer' ? logoStatusFooter : logoStatus}
      width="249"
      height="80"
      alt={alt}
      decoding="async"
      {...props}
    />
  )
}
