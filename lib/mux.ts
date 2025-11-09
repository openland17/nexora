import Mux from "@mux/mux-node"

if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) throw new Error("Mux credentials missing")

export const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
})

