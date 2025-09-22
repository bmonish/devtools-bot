import express from "express";
import { botCommandsMap } from "./commands";
import * as nacl from "tweetnacl";

const app = express();

// Discord requires the raw body to verify the signature. Express's default
// json parser would consume it, so capture the raw body on the request.
app.use((req, res, next) => {
  let data: Buffer[] = [];
  req.on("data", (chunk) => data.push(Buffer.from(chunk)));
  req.on("end", () => {
    // attach rawBody for verification and parsed JSON for convenience
    (req as any).rawBody = (Buffer.concat as any)(data).toString();
    try {
      (req as any).body = JSON.parse((req as any).rawBody || "{}");
    } catch (e) {
      (req as any).body = {};
    }
    next();
  });
});

const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY || "";

function verifySignature(
  rawBody: string,
  signature: string | undefined,
  timestamp: string | undefined
) {
  if (!signature || !timestamp || !DISCORD_PUBLIC_KEY) return false;
  try {
    const msgBuffer = Buffer.from(timestamp + rawBody, "utf8");

    const sigStr = signature.replace(/^0x/, "");
    const pubStr = DISCORD_PUBLIC_KEY.replace(/^0x/, "");

    let sigBuf: Buffer | null = null;
    let pubBuf: Buffer | null = null;

    // try hex first, then base64
    try {
      sigBuf = Buffer.from(sigStr, "hex");
    } catch (e) {
      try {
        sigBuf = Buffer.from(sigStr, "base64");
      } catch (e) {
        sigBuf = null;
      }
    }

    try {
      pubBuf = Buffer.from(pubStr, "hex");
    } catch (e) {
      try {
        pubBuf = Buffer.from(pubStr, "base64");
      } catch (e) {
        pubBuf = null;
      }
    }

    if (!sigBuf || !pubBuf) return false;

    const msgU8 = new Uint8Array(msgBuffer);
    const sigU8 = new Uint8Array(sigBuf);
    const pubU8 = new Uint8Array(pubBuf);

    // Try common tweetnacl function locations to maximize compatibility.
    const anyNacl = nacl as any;
    if (
      anyNacl &&
      anyNacl.sign &&
      anyNacl.sign.detached &&
      typeof anyNacl.sign.detached.verify === "function"
    ) {
      return anyNacl.sign.detached.verify(msgU8, sigU8, pubU8);
    }

    if (typeof anyNacl.sign_detached_verify === "function") {
      return anyNacl.sign_detached_verify(msgU8, sigU8, pubU8);
    }

    if (typeof anyNacl.detached_verify === "function") {
      return anyNacl.detached_verify(msgU8, sigU8, pubU8);
    }

    // last resort: some builds expose nacl.sign.detached as a function that itself
    // performs verification when called with verify semantics — try calling it
    // (this is unlikely, but keeps compatibility).
    if (
      anyNacl.sign &&
      anyNacl.sign.detached &&
      typeof anyNacl.sign.detached === "function"
    ) {
      try {
        // some variants return boolean when used as verify
        const maybe = anyNacl.sign.detached(msgU8, sigU8, pubU8);
        if (typeof maybe === "boolean") return maybe;
      } catch (e) {
        // ignore
      }
    }

    return false;
  } catch (e) {
    return false;
  }
}

// Minimal Interaction-like object to allow existing command.execute functions
// to run unchanged. We'll provide the fields/methods they rely on: isCommand,
// options.get, reply, and commandName.
class FakeOptions {
  private opts: Map<string, any>;
  constructor(optionsArray: any[] = []) {
    this.opts = new Map();
    for (const o of optionsArray) {
      this.opts.set(o.name, { value: o.value });
    }
  }
  get(name: string) {
    return this.opts.get(name) || null;
  }
}

class FakeInteraction {
  body: any;
  replied = false;
  replyPayload: any = null;
  constructor(body: any) {
    this.body = body;
  }
  isCommand() {
    return this.body.type === 2 || !!this.body.data; // type 2 is application command
  }
  get commandName() {
    return this.body?.data?.name;
  }
  get options() {
    return new FakeOptions(this.body?.data?.options || []);
  }
  async reply(payload: any) {
    this.replied = true;
    this.replyPayload = payload;
    return;
  }
}

app.post("/api/interactions", async (req, res) => {
  console.log("Received interaction", (req as any).body);
  const rawBody = (req as any).rawBody || "";
  const signature = req.header("x-signature-ed25519");
  const timestamp = req.header("x-signature-timestamp");

  if (!verifySignature(rawBody, signature, timestamp)) {
    console.log("Invalid request signature", { signature, timestamp });
    res.status(401).send("invalid request signature");
    return;
  }

  const body = (req as any).body || {};

  // Ping
  if (body.type === 1) {
    res.json({ type: 1 });
    return;
  }

  const interaction = new FakeInteraction(body);

  if (!interaction.isCommand()) {
    res.status(400).send("not a command");
    return;
  }

  const commandName = interaction.commandName;
  const command = (botCommandsMap as any)[commandName];

  if (!command) {
    res.json({ type: 4, data: { content: "Command not found" } });
    return;
  }

  try {
    await command.execute(interaction as any);

    // If the command used interaction.reply with embeds or content, return
    // a deferred response type 4 with the content captured.
    if (interaction.replied) {
      // If replyPayload is a string, return as content; if it's an object with
      // embeds or other fields, forward them.
      const payload = interaction.replyPayload;
      if (typeof payload === "string") {
        res.json({ type: 4, data: { content: payload } });
      } else if (payload && payload.embeds) {
        res.json({ type: 4, data: { embeds: payload.embeds } });
      } else {
        res.json({ type: 4, data: payload || { content: "OK" } });
      }
      return;
    }

    // If command didn't reply, send an empty acknowledgement
    res.json({ type: 5 });
  } catch (e: any) {
    console.error("command.execute error", e);
    res.json({ type: 4, data: { content: "Internal error" } });
  }
});

app.get("/status", (req, res) => {
  res.json({
    status: "ok",
    version: process.version,
    platform: process.platform,
  });
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
