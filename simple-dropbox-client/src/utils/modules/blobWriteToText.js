export default async function (blob) {
  const text = await blob.text();

  return text;
}
