'use server'

// import {getNounData } from '@nouns/assets';
import { DecodedImage, PNGCollectionEncoder} from '@nouns/sdk';
import Image from 'next/image'
import {NounData, NounSeed} from "@nouns/assets/dist/types";




import { bgcolors, palette, images } from '../../../../packages/objects-package/files/image-data.json';
const {bodies, mouths, decoration, masks} = images;



const getNounData = (seed: NounSeed): NounData => {
  return {
    parts: [
      bodies[seed.body],
      mouths[seed.accessory],
      decoration[seed.head],
      masks[seed.glasses],
    ],
    background: bgcolors[seed.background],
  };
};

const decodeImage = (image: string): DecodedImage => {
  const data = image.replace(/^0x/, '');
  const paletteIndex = parseInt(data.substring(0, 2), 16);
  const bounds = {
    top: parseInt(data.substring(2, 4), 16),
    right: parseInt(data.substring(4, 6), 16),
    bottom: parseInt(data.substring(6, 8), 16),
    left: parseInt(data.substring(8, 10), 16),
  };
  const rects = data.substring(10);

  return {
    paletteIndex,
    bounds,
    rects:
      rects
        ?.match(/.{1,4}/g)
        ?.map(rect => [parseInt(rect.substring(0, 2), 16), parseInt(rect.substring(2, 4), 16)]) ??
      [],
  };
};


const getRectLength = (currentX: number, drawLength: number, rightBound: number): number => {
    const remainingPixelsInLine = rightBound - currentX;
    return drawLength <= remainingPixelsInLine ? drawLength : remainingPixelsInLine;
};
//
const buildSVG = (
    parts: { data: string }[],
    paletteColors: string[],
    bgColor?: string,
): string => {
    const svgWithoutEndTag = parts.reduce((result, part) => {
        const svgRects: string[] = [];
        const { bounds, rects } = decodeImage(part.data);

        let currentX = bounds.left;
        let currentY = bounds.top;

        rects.forEach(draw => {
            let drawLength = draw[0];
            const colorIndex = draw[1];
            const hexColor = paletteColors[colorIndex];



            let length = getRectLength(currentX, drawLength, bounds.right);

            while (length > 0) {

                // Do not push rect if transparent
                if (colorIndex !== 0) {
                    svgRects.push(
                        `<rect width="${length * 10}" height="10" x="${currentX * 10}" y="${
                            currentY * 10
                        }" fill="#${hexColor}" />`,
                    );
                }

                currentX += length;
                if (currentX === bounds.right) {
                    currentX = bounds.left;
                    currentY++;
                }

                drawLength -= length;
                length = getRectLength(currentX, drawLength, bounds.right);
            }
        });
        result += svgRects.join('');

        return result;

    }, `<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="${bgColor ? `#${bgColor}` : 'none'}" />`);
    return `${svgWithoutEndTag}</svg>`;

};


export default async function Page() {
  // const seed = {...getRandomNounSeed()};
  // const seed:NounSeed = {
  //     background:1,
  //     body: 2,
  //     accessory: 7,
  //     head: 1,
  //     glasses: 1,
  //
  // }

  const seed:NounSeed = {
    background:1,
    body: 2,
    accessory: 1,
    head: 1,
    glasses: 1,

  }


  // const seed:NounSeed = {
  //   background:1,
  //   body: 7,
  //   accessory: 110,
  //   head: 37,
  //   glasses: 19,
  //
  // }
  // console.log(seed)
  const {parts, background} = getNounData(seed);

  console.log(parts)
  // const encoder = new PNGCollectionEncoder(palette);
  // console.log(parts,background);
  // const encoder = await new PNGCollectionEncoder(ImageData.palette);
  // console.log("parts")
  // console.log(parts)
  // console.log("encoder.data.palette")
  // console.log(encoder.data.palette)


  // const svg = buildSVG(parts, encoder.data.palette, background);
  // console.log(svg)
  // const svg =

    // console.log(svg)
    // @ts-ignore
  // const { bounds, rects } =   decodeImage(parts[0].data)
  //   console.log(rects)
  // let currentX = bounds.left;
  //
  //   rects.forEach(draw => {
  //       let drawLength = draw[0]
  //       // console.log(drawLength)
  //
  //       const remainingPixelsInLine = bounds.right - currentX;
  //       let length =  drawLength <= remainingPixelsInLine ? drawLength : remainingPixelsInLine;
  //       console.log(length)
  //
  //
  //       // console.log(length)
  //   });





  // // @ts-ignore
  // const { bounds, rects } =   decodeImage(parts[0].data)
  //   // @ts-ignore
  // const { bounds2, rects2 } =   decodeImage(parts[1].data)
  //   // @ts-ignore
  // const { bounds3, rects3 } =   decodeImage(parts[2].data)
  //   // @ts-ignore
  // const { bounds4, rects4 } =   decodeImage(parts[3].data)
  //   // @ts-ignore
  // // console.log(parts)
  // console.log(bounds,rects)


  // console.log(svg);

  // const generateNounSvg = useCallback(
  //   (amount: number = 1) => {
  //     for (let i = 0; i < amount; i++) {
  //       const seed = { ...getRandomNounSeed(), ...modSeed };
  //       const { parts, background } = getNounData(seed);
  //       const svg = buildSVG(parts, encoder.data.palette, background);
  //       setNounSvgs(prev => {
  //         return prev ? [svg, ...prev] : [svg];
  //       });
  //     }
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [pendingTrait, modSeed],
  // );

  // console.log(`data:image/svg+xml;base64,${btoa(svg)}`)
  // console.log()
  return (
    <main className='flex flex-col min-h-screen min-w-full'>
      <div>
        1
      </div>
      {/*<Image*/}
      {/*  src={`data:image/svg+xml;base64,${btoa(svg)}`}*/}
      {/*  width={500}*/}
      {/*  height={500}*/}
      {/*  alt="Picture of the author"*/}
      {/*/>*/}
    </main>
  );
}
