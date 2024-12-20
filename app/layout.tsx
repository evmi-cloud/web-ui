'use client';

import '@mantine/core/styles.css';

import { AppShell, Burger, ColorSchemeScript, Group, MantineProvider } from '@mantine/core';
import { MantineLogo } from '@mantinex/mantine-logo';
import { useDisclosure } from '@mantine/hooks';
import { theme } from '../theme';
import { Navbar } from '../components/navbar/navbar';
import { ClientProvider } from '../components/providers/client-context';

export default function RootLayout({ children }: { children: any }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <ClientProvider>
            <AppShell
              header={{ height: 60 }}
              navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
              padding="md"
            >
              <AppShell.Header>
                <Group h="100%" px="md">
                  <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                  <MantineLogo size={30} />
                </Group>
              </AppShell.Header>
              <AppShell.Navbar p="md">
                <Navbar />
              </AppShell.Navbar>
              <AppShell.Main>{children}</AppShell.Main>
            </AppShell>
          </ClientProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
