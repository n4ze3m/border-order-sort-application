import { type AppType } from "next/app";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <MantineProvider
    withGlobalStyles={true}
    withNormalizeCSS={true}
    theme={{
      colorScheme: 'dark',
    }}
  > <NotificationsProvider>
      <Component {...pageProps} />
    </NotificationsProvider>
  </MantineProvider>
};

export default trpc.withTRPC(MyApp);
