export async function generateCloudinarySignature(
  apiSecret: string,
  folder: string = 'custom-gifts'
) {
  const timestamp = Math.round(new Date().getTime() / 1000).toString();
  // Cloudinary signatures require parameters to be sorted alphabetically
  const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  
  const encoder = new TextEncoder();
  const data = encoder.encode(signatureString);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return { signature, timestamp };
}
