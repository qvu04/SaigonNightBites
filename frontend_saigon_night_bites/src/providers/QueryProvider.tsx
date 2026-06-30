import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

export interface QueryProvidersProps {
    children: ReactNode;
};

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 60 * 1000,
            refetchOnReconnect: true,
        }
    }
})
export const QueryProvider = (props: QueryProvidersProps) => {
    const { children } = props;
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}