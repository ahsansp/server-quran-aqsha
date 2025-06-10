export async function GET(request, { params }) {
  const { qoriName } = params;
  const getQoriInfo = await fetch(
    `https://api.github.com/repos/quranAqshaQori/${qoriName}/releases/tags/qori`,
    { next: { revalidate: 600 } }
  );
  const qoriInfo = await getQoriInfo.json();
  //   console.log(qoriInfo);
  let size = 0;
  let fileNames = [];
  qoriInfo.assets.forEach((value) => {
    size += value.size || 0;
    const fileName = value.name;
    const currentSize = value.size;
    fileNames.push({ fileName, size: currentSize });
  });
  return Response.json({ totalBytes: size, fileNames });
}
