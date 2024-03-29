module objectsDAO::gov {
    use std::signer;
    use std::signer::address_of;
    use std::string;
    use std::vector;
    use aptos_framework::account::{SignerCapability, create_resource_account};
    use aptos_framework::object::Object;
    use aptos_framework::timestamp;
    use objectsDAO::token::ObjectToken;

    /// Timeout for the proposal.
    // TODO: nfts have diff weight.
    // TODO: action: transfer object to sender.
    // TODO: batch transfer object.
    const ETimeout: u64 = 10;
    const ETimenotReached: u64 = 11;

    struct GovManager has key {
        resource_signer_cap: SignerCapability,
        proposals: vector<Proposal>

    }

    struct Proposal has key, store, copy {
        id: u64,
        creater: address,
        name: string::String,
        description: string::String,
        start_timestamp: u64,
        end_timestamp: u64,
        approve_num: u64,
        deny_num: u64,
        excuted_hash: string::String
    }

    struct Vote has key, store {
        proposal_id: u64,
        voter: address,
        decision: bool,
        reason: string::String
    }

    fun init_module(account: &signer) {
       let (_resource_signer, resource_signer_cap) = create_resource_account(account, b"");
        move_to(account, GovManager {
            resource_signer_cap,
            proposals: vector::empty<Proposal>()
        });
    }

    public entry fun propose(
        sender: &signer,
        _objects: vector<Object<ObjectToken>>,
        name: string::String,
        description: string::String,
        start_timestamp: u64,
        end_timestamp: u64,
    ) acquires GovManager {
        let gov_manager = borrow_global_mut<GovManager>(@objectsDAO);
        let proposal_id = vector::length(&gov_manager.proposals);

        // create a new proposal.
        let proposal = Proposal {
            id: proposal_id,
            creater: address_of(sender),
            name: name,
            description: description,
            start_timestamp: start_timestamp,
            end_timestamp: end_timestamp,
            approve_num: 0,
            deny_num: 0,
            excuted_hash: string::utf8(b"")
        };

        vector::push_back(&mut gov_manager.proposals, proposal);
    }

    public entry fun vote(voter: &signer, _nft: Object<ObjectToken>, proposal_id: u64, decision: bool) acquires GovManager {
        let gov_manager = borrow_global_mut<GovManager>(@objectsDAO);
        let proposal = vector::borrow_mut(&mut gov_manager.proposals, proposal_id);
        let time_now: u64 = timestamp::now_seconds();
        // vote for a proposal if voter has one more NFT.
        assert!(time_now < proposal.end_timestamp, ETimeout);
        if(decision) {
            proposal.approve_num = proposal.approve_num + 1;
        } else {
            proposal.deny_num = proposal.deny_num + 1;
        };
        // create a new vote.
        let vote = Vote {
            proposal_id: proposal_id,
            voter: signer::address_of(voter),
            decision: decision,
            reason: string::utf8(b"")
        };
        move_to(voter, vote)
    }

    #[view]
    public fun get_result(proposal_id: u64): bool acquires GovManager {
        let gov_manager = borrow_global_mut<GovManager>(@objectsDAO);
        let proposals = &mut gov_manager.proposals;
        let proposal = vector::borrow_mut(proposals, proposal_id);
        let time_now: u64 = timestamp::now_seconds();
        assert!(time_now > proposal.end_timestamp, ETimenotReached);
        if(proposal.approve_num > proposal.deny_num) {
            true
        } else {
            false
        }
    }

    #[view]
    public fun get_proposal(proposal_id: u64): Proposal acquires GovManager {
        let gov_manager = borrow_global_mut<GovManager>(@objectsDAO);
        let proposals = &mut gov_manager.proposals;
        *vector::borrow(proposals, proposal_id)
    }

    #[view]
    public fun get_all_proposals(): vector<Proposal> acquires GovManager {
        let gov_manager = borrow_global_mut<GovManager>(@objectsDAO);
        gov_manager.proposals
    }

    public entry fun excuted_confirm(proposal_id: u64, tx_id: string::String) acquires GovManager {
        let gov_manager = borrow_global_mut<GovManager>(@objectsDAO);
        let proposal = vector::borrow_mut(&mut gov_manager.proposals, proposal_id);
        proposal.excuted_hash = tx_id;
    }
}
