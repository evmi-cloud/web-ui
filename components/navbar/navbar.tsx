import { useState } from 'react';
import {
  IconBellRinging,
  IconReceipt2,
} from '@tabler/icons-react';
import classes from './navbar.module.css';

const data = [
  { link: '/blockchains', label: 'Blockchains', icon: IconBellRinging },
  { link: '/abis', label: 'ABIs', icon: IconBellRinging },
  { link: '/stores', label: 'Stores', icon: IconBellRinging },
  { link: '/pipelines', label: 'Pipelines', icon: IconBellRinging },
];

export function Navbar() {
  const [active, setActive] = useState('Billing');

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={() => {
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <div className={classes.navbarMain}>
      {links}
    </div>
  );
}
