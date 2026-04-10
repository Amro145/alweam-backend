export async function generateCloudinarySignature(
  apiSecret: string
) {
  const timestamp = Math.round(new Date().getTime() / 1000).toString();
  const signatureString = `folder=custom-gifts&timestamp=${timestamp}${apiSecret}`;
  
  const encoder = new TextEncoder();
  const data = encoder.encode(signatureString);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return { signature, timestamp };
}
