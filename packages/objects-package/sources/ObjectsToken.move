module objectsDAO::token{
    use std::signer;
    use std::string;
    use std::string::String;
    use aptos_std::string_utils;
    use aptos_std::table;
    use aptos_std::table::Table;
    use aptos_framework::event::emit;
    use aptos_framework::object;
    use aptos_framework::object::Object;
    use objectsDAO::objects_seeder;
    use objectsDAO::objects_seeder::Seed;
    #[test_only]
    use aptos_std::debug;
    #[test_only]
    use aptos_std::string_utils::debug_string;
    #[test_only]
    use aptos_framework::timestamp;
    #[test_only]
    use objectsDAO::descriptor::{init_objects_descriptor, get_backgrounds};
    #[test_only]
    use objectsDAO::objects_seeder::test_generateSVGImage;

    const SYMBOL: vector<u8> = b"OBJECT";
    const COLLECTION_NAME: vector<u8> = b"Objects Dao Coin";
    const COLLECTION_DESCRIPTION: vector<u8> = b"Objects Dao Coin";
    const COLLECTION_URL: vector<u8> = b"https://blog.sui.io/content/images/2023/04/Sui_Droplet_Logo_Blue-3.png";
    const MAX_SUPPLY: u64 = 1820;

    struct ObjectTokenConfig has key, store {
        objects_dao_treasury: address,
        seeds: Table<u256,Seed>,
        current_object_id: u256,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct ObjectToken has key {
        name: String,
        uri: String
    }

    #[event]
    struct MintEvent has drop, store {
        minter_address: address,
        object_address: address,
        randomness: u64,
    }

    fun init_module(account: &signer) {
        move_to(account, ObjectTokenConfig {
            objects_dao_treasury: signer::address_of(account),
            seeds: table::new<u256,Seed>(),
            current_object_id: 0
        });
    }

    public fun mint(minter: &signer): address acquires ObjectTokenConfig {
        let object_token_config = borrow_global_mut<ObjectTokenConfig>(@objectsDAO);

        let (seed, randomness) = objects_seeder::generateSeed();
        let uri = objects_seeder::generateSVGImage(seed);
        let name = string::utf8(b"Object# ");
        string::append(&mut name, string_utils::to_string(&object_token_config.current_object_id));

        let minter_address = signer::address_of(minter);
        let constructor_ref = object::create_object(minter_address);
        let object_signer = object::generate_signer(&constructor_ref);
        move_to(&object_signer, ObjectToken { name, uri });

        let object_token = borrow_global_mut<ObjectTokenConfig>(@objectsDAO);
        table::add<u256, Seed>(&mut object_token.seeds,object_token.current_object_id, seed);
        object_token.current_object_id = object_token.current_object_id + 1;

        emit(MintEvent {minter_address, object_address: object::address_from_constructor_ref(&constructor_ref), randomness  });

        object::address_from_constructor_ref(&constructor_ref)
    }

    #[view]
    public fun view_token_svg(token_obj: Object<ObjectToken>): ObjectToken acquires ObjectToken {
        let token_address = object::object_address(&token_obj);
        move_from<ObjectToken>(token_address)
    }

    #[view]
    public fun get_object_address(addr: address): address {
        let constructor_ref = object::create_object(addr);
        object::address_from_constructor_ref(&constructor_ref)
    }


    #[test_only(aptos_framework = @0x1, deployer = @objectsDAO, sender = @0x123)]
    public fun init_token(aptos_framework: &signer, deployer: &signer, sender: &signer){
        test_generateSVGImage(aptos_framework, deployer, sender);
        init_module(deployer);
    }



}
