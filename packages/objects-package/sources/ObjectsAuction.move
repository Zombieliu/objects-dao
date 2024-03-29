module objectsDAO::objects_auctio  {
    use std::signer;
    use std::signer::address_of;
    use std::vector;
    use aptos_framework::account::{SignerCapability, create_resource_account,
        create_signer_with_capability
    };
    use aptos_framework::coin;
    use aptos_framework::coin::Coin;
    use aptos_framework::object;
    use aptos_framework::timestamp;
    use objectsDAO::objectsCoin::OBJECT;
    use objectsDAO::token::{ObjectToken, mint};
    #[test_only]
    use aptos_framework::account::create_account_for_test;
    #[test_only]
    use aptos_framework::timestamp::update_global_time_for_test_secs;
    #[test_only]
    use objectsDAO::objectsCoin::{init_coin, register};
    #[test_only]
    use objectsDAO::objects_seeder::test_generateSVGImage;
    #[test_only]
    use objectsDAO::token::init_token;
    #[test_only]
    use std::debug;

    const AUCTION_STARTED: u64 = 0;
    const AUCTION_SETTLED: u64 = 1;
    const AUCTION_COMPLETED: u64 = 2;

    const OBJECT_NOT_AUCTION: u64 = 3;
    const AUCTION_EXPIRED: u64 = 4;
    const LESS_RESERVEPRICE: u64 = 5;
    const LESS_MIN_BID_PRICE: u64 = 6;

    struct AuctionManager has key {
        treasury: address,
        temp_coin: Coin<OBJECT>,
        resource_signer_cap: SignerCapability,
        reserve_price: u64,
        minBidIncrementPercentage: u256,
        // The minimum amount of time left in an auction after a new bid is created
        time_buffer: u64,
        duration: u64,
        auctions: vector<Auction>
    }

    struct Bidder has copy, store {
        bid_time: u64,
        bid_price: u64,
        bid_address: address
    }

    struct Auction has copy, store {
        object_address: address,
        // The current highest bid amount
        amount: u64,
        // The time that the auction started
        start_time: u64,
        // The time that the auction is scheduled to end
        end_time: u64,
        // The address of the current highest bid
        payable_bidder: address,

        bid_list: vector<Bidder>,
    }

    fun init_module(account: &signer) {
        let (_, resource_signer_cap) = create_resource_account(account, b"auction");
        let auction_manager = AuctionManager {
            treasury: address_of(account),
            temp_coin: coin::zero(),
            resource_signer_cap,
            reserve_price: 0,
            minBidIncrementPercentage: 0u256,
            time_buffer: 120,
            duration: 300,
            auctions: vector::empty()
        };
        move_to(account, auction_manager);
    }

    #[view]
    public fun get_all_auctions(): vector<Auction> acquires AuctionManager {
        let auction_manager = borrow_global<AuctionManager>(@objectsDAO);
        auction_manager.auctions
    }

    #[view]
    public fun get_last_auction(): Auction acquires AuctionManager {
        let auction_manager = borrow_global<AuctionManager>(@objectsDAO);
        let len = vector::length(&auction_manager.auctions);
        *vector::borrow(&auction_manager.auctions, len - 1)
    }

    entry fun start_auction() acquires AuctionManager {
        let auction_manager = borrow_global_mut<AuctionManager>(@objectsDAO);
        let start_time = timestamp::now_seconds();
        let end_time = start_time + auction_manager.duration;
        let resource_signer = create_signer_with_capability(&auction_manager.resource_signer_cap);
        let object_address = mint(&resource_signer);
        let auction = Auction {
            object_address,
            amount: 0,
            start_time,
            end_time,
            payable_bidder: @0,
            bid_list: vector::empty()
        };
        vector::push_back(&mut auction_manager.auctions, auction);
    }

    public entry fun create_bid(sender: &signer, price: u64) acquires AuctionManager {
        let current_timestamp = timestamp::now_seconds();
        let auction_manager = borrow_global_mut<AuctionManager>(@objectsDAO);
        let auction_length = vector::length(&auction_manager.auctions);
        let auction = vector::borrow_mut(&mut auction_manager.auctions, auction_length - 1);

        assert!(auction_manager.reserve_price <= price, 0);
        assert!(auction.amount <= price, 0);
        assert!(current_timestamp < auction.end_time, AUCTION_EXPIRED);

        let price_coin = coin::withdraw<OBJECT>(sender,price);

        let last_bidder = auction.payable_bidder;

        // Refund the last bidder, if applicable
        if(last_bidder != @0){
            let last_amount = coin::extract_all(&mut auction_manager.temp_coin);
            coin::deposit(last_bidder, last_amount);
        };

        coin::merge(&mut auction_manager.temp_coin, price_coin);
        auction.payable_bidder = signer::address_of(sender);
        auction.amount = price;
        vector::push_back(&mut auction.bid_list, Bidder {
            bid_address: signer::address_of(sender),
            bid_time: current_timestamp,
            bid_price: price
        });

        // Extend the auction if the bid was received within `timeBuffer` of the auction end time
        let extended = auction.end_time - current_timestamp < auction_manager.time_buffer;
        if (extended) {
            auction.end_time = current_timestamp + auction_manager.time_buffer;
        };
    }

    entry fun claim() acquires AuctionManager {
        let current_timestamp = timestamp::now_seconds();
        let auction_manager = borrow_global_mut<AuctionManager>(@objectsDAO);
        let auction_length = vector::length(&auction_manager.auctions);
        let auction = vector::borrow_mut(&mut auction_manager.auctions, auction_length - 1);

        assert!(current_timestamp > auction.end_time, AUCTION_EXPIRED);

        let price_coin = coin::extract_all<OBJECT>(&mut auction_manager.temp_coin);
        coin::deposit(auction_manager.treasury, price_coin);

        let resource_signer = create_signer_with_capability(&auction_manager.resource_signer_cap);
        object::transfer(&resource_signer, object::address_to_object<ObjectToken>(auction.object_address), auction.payable_bidder);

        start_auction();
    }

    #[test(aptos_framework = @0x1, deployer = @objectsDAO, sender = @0x123)]
    fun t(aptos_framework: &signer, deployer: &signer, sender: &signer) acquires AuctionManager {
        create_account_for_test(signer::address_of(deployer));

        init_token(aptos_framework, deployer, sender);
        init_coin(deployer);
        init_module(deployer);

        let auction = borrow_global<AuctionManager>(signer::address_of(deployer));
        debug::print(auction);

        create_bid(deployer, 10);

        let current_time = timestamp::now_seconds();
        update_global_time_for_test_secs(current_time + 301);

        claim();
    }
}
