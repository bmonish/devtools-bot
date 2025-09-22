declare module "tweetnacl" {
  export function sign_detached_verify(
    message: Uint8Array,
    sig: Uint8Array,
    publicKey: Uint8Array
  ): boolean;
  export namespace sign {
    function detached(message: Uint8Array, secretKey: Uint8Array): Uint8Array;
    function detached_verify(
      message: Uint8Array,
      sig: Uint8Array,
      publicKey: Uint8Array
    ): boolean;
  }
  export function sign_detached(
    message: Uint8Array,
    secretKey: Uint8Array
  ): Uint8Array;
  export function sign_detached_verify(
    message: Uint8Array,
    sig: Uint8Array,
    publicKey: Uint8Array
  ): boolean;
  export function randomBytes(n: number): Uint8Array;
  export const version: string;
}
