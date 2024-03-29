module objectsDAO::objects_seeder {
    use std::string::String;
    use std::vector;
    use objectsDAO::multi_part_rel_to_svg::{create_svg_params, generateSVG};
    use objectsDAO::descriptor::{backgroundCount, bodyCount,
      get_bodies, get_backgrounds, get_accessories, get_heads, get_glasses, accessoriesCount, glassesCount, headsCount,
    };
    #[test_only]
    use std::string;
    #[test_only]
    use objectsDAO::descriptor::{addManyBodies, addManyBackgrounds,
      addColorsToPalette, init_objects_descriptor, addManyGlasses, addManyHeads, addManyAccessories
    };



  const NAME: vector<u8> = b"Objects";
  const DESCRIPTION: vector<u8> = b"Object NFT";

  // #[test_only]
  // use objectsDAO::descriptor::{init_test, addColorsToPalette, addManyBackgrounds, addManyBodies, addManyMasks,
  //   addManyDecorations, addManyMouths
  // };
  // #[test_only]
  // use sui::test_scenario;
  #[test_only]
  use std::debug;
  //
  struct Seed has store,copy, drop {
    background: u64,
    body: u64,
    accessory: u64,
    head: u64,
    glasses: u64
  }

  struct SVGSEED has copy, drop {
    seed: Seed
  }

  struct SVG has copy, drop {
    svg: String
  }

  struct Random has copy,drop{
    value: u256
  }

  public fun generateSeed(): (Seed, u64) {
    let randomness = aptos_framework::randomness::u64_integer();
    // let randomness = timestamp::now_seconds();
    let backgroundCount = backgroundCount();
    let bodyCount = bodyCount();
    let accessoriesCount = accessoriesCount();
    let headsCount = headsCount();
    let glassesCount = glassesCount();

    (Seed {
      background: randomness % backgroundCount,
      body: randomness % bodyCount,
      accessory: randomness % accessoriesCount,
      head: randomness % headsCount,
      glasses: randomness % glassesCount
    },
      randomness
    )
  }

  public fun generateSVGImage(seed: Seed): String {
    let parts = getPartsForSeed_(seed);
    let backgrounds = get_backgrounds();
    let background = *vector::borrow(&backgrounds, seed.background);
    let params = create_svg_params(parts, background);
    let svg = generateSVG(params);
    svg
  }

  fun getPartsForSeed_(seed: Seed): vector<String> {
    let bodies = get_bodies();
    let accessories = get_accessories();
    let heads = get_heads();
    let glasses = get_glasses();
    let body = *vector::borrow(&bodies, seed.body);
    let accessory = *vector::borrow(&accessories, seed.accessory);
    let head = *vector::borrow(&heads, seed.head);
    let glass = *vector::borrow(&glasses, seed.glasses);

    let parts: vector<String> = vector[body, accessory, head, glass];
    parts
  }


  #[test_only(aptos_framework = @0x1, deployer = @objectsDAO, sender = @0x123)]
  public fun test_generateSVGImage(aptos_framework: &signer, deployer: &signer, sender: &signer) {
    timestamp::set_time_has_started_for_testing(aptos_framework);
    timestamp::fast_forward_seconds(1709126369766);

    init_objects_descriptor(deployer);
  }
}
