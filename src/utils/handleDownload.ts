const handleDownload = ({
  source,
  fileName,
}: {
  source: string;
  fileName: string;
}) => {
  const a = document.createElement("a");

  a.href = source;

  a.download = fileName;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);
};

export default handleDownload;
