import { PNGCollectionEncoder, PngImage } from '@nouns/sdk';
import { promises as fs } from 'fs';
import path from 'path';
import { readPngImage } from './image-utils';

const DESTINATION = path.join(__dirname, '../files/image-data.json');

const encode = async () => {
  const encoder = new PNGCollectionEncoder();

  console.log(encoder)

  const partfolders = ['1-bodies', '2-mouths', '3-decoration', '4-masks'];
  for (const folder of partfolders) {
    const folderpath = path.join(__dirname, './images/v0', folder);
    const files = await fs.readdir(folderpath);
    for (const file of files) {
      const image = await readPngImage(path.join(folderpath, file));
      // console.log(image)
      encoder.encodeImage(file.replace(/\.png$/, ''), image, folder.replace(/^\d-/, ''));
    }
  }
  console.log(encoder.data)
  await fs.writeFile(
    DESTINATION,
    JSON.stringify(
      {
        bgcolors: ["7eb5cd", "f6f5d5"],
        ...encoder.data,
      },
      null,
      2,
    ),
  );
};

encode();
