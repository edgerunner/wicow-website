import { inspect } from "@xstate/inspect";

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_DEVELOPER_TOOLS) {
    inspect({
        url: "https://statecharts.io/inspect",
        iframe: false
    });          
}