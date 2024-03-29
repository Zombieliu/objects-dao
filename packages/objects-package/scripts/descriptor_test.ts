import { bgcolors, palette, images } from '../files/image-data.json';
import {chunkArray} from "./utils";
import { promises as fs } from 'fs';
import path from "path";

const main =  async () =>{

  const {bodies, accessories, heads, glasses} = images;



    // let a = bodies.map(({ data }) => `b${data}`)
    // let a = accessories.map(({ data }) => `b${data}`)
    // let a = heads.map(({ data }) => `b${data}`,)
    let a = heads.map(({ data }) => `string::utf8(b${data})`)

    const DESTINATION = path.join(__dirname, '../files/image-data-heads.json');
    await fs.writeFile(
        DESTINATION,
        JSON.stringify(
            {
              a
            },
            null,
            2,
        ),
    );


}

main();
