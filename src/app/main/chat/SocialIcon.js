function StatusIcon(props) {
  const url = process.env.PUBLIC_URL;
  switch (props.status) {
    case 'line':
      return (
        <img
          className="logo-icon w-16 h-16 block rounded-full"
          src={`${process.env.PUBLIC_URL}/assets/images/logos/LINE.png`}
          alt="logo"
        />
      );
    case 'facebook':
      return (
        <img
          className="logo-icon w-16 h-16 block rounded-full"
          src={`${process.env.PUBLIC_URL}/assets/images/logos/Facebook.png`}
          alt="logo"
        />
      );

    default:
      return null;
  }
}

export default StatusIcon;
