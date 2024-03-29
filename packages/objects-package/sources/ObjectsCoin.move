module objectsDAO::objectsCoin{
    use std::signer;
    use std::string;
    use aptos_framework::coin;
    use aptos_framework::coin::{MintCapability, BurnCapability};

    /// Only fungible asset metadata owner can make changes.
    const ENOT_OWNER: u64 = 1;

    const SYMBOL: vector<u8> = b"OBJECT";
    const NAME: vector<u8> = b"Objects Dao Coin";
    const DESCRIPTION: vector<u8> = b"Objects Dao Coin";
    const ICON_URL: vector<u8> = b"https://pbs.twimg.com/profile_images/1467601380567359498/oKcnQo_S_400x400.jpg";
    const DECIMALS: u8 = 8;
    // 100e
    const MAX_SUPPLY: u64 = 10000000000 * 10000000;

    struct OBJECT { }

    struct Cap<phantom CoinType> has key {
        mint: MintCapability<OBJECT>,
        burn: BurnCapability<OBJECT>,
    }

    /// Initialize metadata object and store the refs.
    fun init_module(admin: &signer) acquires Cap {
        let (b_cap,f_cap,m_cap) = coin::initialize<OBJECT>(
            admin,
            string::utf8(NAME),
            string::utf8(SYMBOL),
            DECIMALS,
            true
        );
        coin::destroy_freeze_cap(f_cap);

        move_to(admin, Cap<OBJECT>{
            mint:m_cap,
            burn:b_cap
        });

        coin::register<OBJECT>(admin);

        let admin_addr = signer::address_of(admin);
        let cap = borrow_global_mut<Cap<OBJECT>>(admin_addr);
        let mint_object = coin::mint(MAX_SUPPLY,&cap.mint);
        coin::deposit(admin_addr, mint_object);
    }

    public entry fun register(sender: &signer){
        coin::register<OBJECT>(sender);
    }

    #[test_only]
    public fun init_coin(deployer: &signer) acquires Cap {
        init_module(deployer)
    }
}
