export default function (blob, fileName = "text.txt") {
  const fileURL = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = fileURL;
  link.download = fileName;
  link.click();
}
