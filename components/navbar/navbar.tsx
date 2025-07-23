import { useState } from 'react';
import {
  IconAffiliate,
  IconAlignBoxLeftStretch,
  IconBellRinging,
  IconLoadBalancer,
  IconReceipt2,
  IconServer2,
  IconTimelineEventText,
} from '@tabler/icons-react';
import classes from './navbar.module.css';

const data = [
  { link: '/abis', label: 'ABIs', icon: IconAlignBoxLeftStretch },
  { link: '/blockchains', label: 'Blockchains', icon: IconAffiliate },
  { link: '/stores', label: 'Stores', icon: IconServer2 },
  { link: '/pipelines', label: 'Pipelines', icon: IconTimelineEventText },
  { link: '/instances', label: 'Instances', icon: IconLoadBalancer },
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
