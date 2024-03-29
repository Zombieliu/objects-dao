
import { bgcolors, partcolors, parts } from '../files/encoded-layers.json';


const main =  async () =>{

    const [bodies, accessories, heads, glasses] = parts;

    console.log(bodies.map(({ data }) => data))


}

main();
