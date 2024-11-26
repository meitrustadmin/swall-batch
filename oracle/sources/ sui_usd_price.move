/*
/// Module: oracle
module oracle::oracle;
*/
module oracle::sui_usd_price {
    use std::string::String;
    use sui::package;
    use sui::event;

    /// Define a capability for the admin of the oracle.
    public struct AdminCap has key, store { id: UID }

    public struct SUI_USD_PRICE has drop {}

    /// Define a struct for the SUI USD price oracle
    public struct SuiUsdPriceOracle has key {
        id: UID,
        /// The address of the oracle.
        address: address,
        /// The name of the oracle.
        name: String,
        /// The description of the oracle.
        description: String,
        /// The current price of SUI in USD.
        price: u64,
        /// The timestamp of the last update.
        last_update: u32,
    }

    public struct PriceUpdated has drop, copy {
        price: u64,
        timestamp: u32,
    }

    fun init(sui_usd_price: SUI_USD_PRICE, ctx: &mut TxContext) {
        package::claim_and_keep(sui_usd_price, ctx); // Claim ownership of the one-time witness and keep it

        let cap = AdminCap { id: object::new(ctx) }; // Create a new admin capability object
        transfer::share_object(SuiUsdPriceOracle {
            id: object::new(ctx),
            address: ctx.sender(),
            name: b"SuiUsdPriceOracle".to_string(),
            description: b"A SUI to USD price oracle.".to_string(),
            price: 0,
            last_update: 0,
        });
        transfer::public_transfer(cap, ctx.sender()); // Transfer the admin capability to the sender.
    }

    /// Update the SUI USD price
    public fun update_price(
        _: &AdminCap,
        oracle: &mut SuiUsdPriceOracle,
        new_price: u64,
        timestamp: u32
    ) {
        oracle.price = new_price;
        oracle.last_update = timestamp;
        event::emit(PriceUpdated {
            price: new_price,
            timestamp: timestamp,
        });
    }

    /// Get the current SUI USD price
    public fun get_price(oracle: &SuiUsdPriceOracle): u64 {
        oracle.price
    }

    /// Get the last update timestamp
    public fun get_last_update(oracle: &SuiUsdPriceOracle): u32 {
        oracle.last_update
    }
}
