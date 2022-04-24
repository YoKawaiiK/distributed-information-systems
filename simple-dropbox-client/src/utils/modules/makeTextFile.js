export default function (text, fileName = "text.txt") {
  //   let textFile = null;
  let data = new Blob([text], { type: "text/plain" });

  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  //   if (textFile !== null) {
  //     window.URL.revokeObjectURL(textFile);
  //   }

  //   textFile = window.URL.createObjectURL(data);

  const file = new File([data], fileName + ".txt");

  return file;
}
