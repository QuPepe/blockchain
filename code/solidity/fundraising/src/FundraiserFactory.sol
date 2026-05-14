// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Import the Fundraiser contract so this factory can deploy new Fundraiser instances.
import {Fundraiser} from "./Fundraiser.sol";

/**
 * @title FundraiserFactory
 * @dev Deploys and tracks multiple Fundraiser contracts.
 *
 * This contract follows the factory pattern:
 * - users call createFundraiser() on this factory;
 * - the factory deploys a separate Fundraiser contract;
 * - the deployed Fundraiser contract reference is stored in the private _fundraisers array;
 * - frontends can later retrieve fundraiser addresses through the paginated
 *   fundraisers(limit, offset) function.
 */
contract FundraiserFactory {
    // Private storage array containing all Fundraiser contracts deployed by this factory.
    // Each element is a Fundraiser contract reference.
    // Because the array is private, external callers cannot read it directly;
    // they should use fundraisers(limit, offset) to retrieve fundraiser addresses.
    Fundraiser[] private _fundraisers;

    // SCREAMING_SNAKE_CASE is commonly used for constants.
    // Maximum number of fundraiser addresses returned in one paginated query.
    // This avoids returning an excessively large array in a single read call.
    uint256 internal constant MAX_LIMIT = 20;

    // Emitted whenever this factory deploys a new Fundraiser contract.
    // fundraiser: address of the newly deployed Fundraiser contract.
    // owner: the EOA/user who created the fundraiser and becomes its owner/custodian.
    event FundraiserCreated(address indexed fundraiser, address indexed owner);

    /**
     * @dev Returns the total number of Fundraiser contracts created by this factory.
     * Frontends can use this value to calculate valid pagination ranges.
     */
    function fundraisersCount() public view returns (uint256) {
        return _fundraisers.length;
    }

    /**
     * @dev Creates a new Fundraiser contract and stores it.
     *
     * The caller becomes the owner/custodian of the newly deployed Fundraiser.
     * The beneficiary is the address that receives donated ETH when funds are withdrawn.
     *
     * Requirements:
     * - beneficiary must not be the zero address.
     * - name must not be empty.
     *
     * Emits a {FundraiserCreated} event after deployment.
     */
    function createFundraiser(
        string memory name,
        string memory url,
        string memory imageUrl, // mixedCase
        string memory description,
        address payable beneficiary
    ) public {
        // Reject the zero address because withdrawn ETH would otherwise be sent to an invalid destination.
        require(beneficiary != address(0), "Invalid beneficiary");

        // Require a non-empty fundraiser name for clearer frontend display and better data quality.
        require(bytes(name).length > 0, "Name required");

        // Deploy a new Fundraiser contract.
        // msg.sender is passed as the owner/custodian of the new Fundraiser.
        Fundraiser fundraiser = new Fundraiser(
            name,
            url,
            imageUrl,
            description,
            beneficiary,
            msg.sender // custodian/owner
        );

        // Store the newly deployed Fundraiser contract reference in the factory's private registry.
        _fundraisers.push(fundraiser);

        // Notify off-chain apps and frontends that a new Fundraiser was created.
        emit FundraiserCreated(address(fundraiser), msg.sender);
    }

    /**
     * @dev Returns a paginated list of Fundraiser contract addresses.
     *
     * limit controls the maximum number of records requested.
     * offset controls the starting index in the private _fundraisers array.
     *
     * Example:
     * - offset = 0, limit = 10 returns the first 10 fundraisers.
     * - offset = 10, limit = 10 returns the next 10 fundraisers.
     *
     * The returned size is capped by MAX_LIMIT to avoid overly large read responses.
     */
    function fundraisers(
        uint256 limit,
        uint256 offset
    ) public view returns (address[] memory collection) {
        // Get the current number of Fundraiser contracts created by this factory.
        uint256 count = fundraisersCount();

        // Ensure offset is within the valid range.
        // offset == count is allowed; it returns an empty array.
        require(offset <= count, "Offset out of bounds");

        // Calculate how many fundraisers are available from offset to the end of the array.
        uint256 size = count - offset;

        // If the requested limit is smaller than the remaining records, return only limit records.
        if (size > limit) size = limit;

        // Enforce the factory-level maximum page size.
        if (size > MAX_LIMIT) size = MAX_LIMIT;

        // Create a temporary memory array for the selected fundraiser addresses.
        // Solidity cannot return a partial slice of a storage array directly, so we copy manually.
        collection = new address[](size);

        // Copy the selected Fundraiser contract addresses from storage to memory.
        for (uint256 i = 0; i < size; i++) {
            // offset is the starting index; offset + i selects each requested fundraiser.
            collection[i] = address(_fundraisers[offset + i]);
        }

        // Return the paginated address list to the caller or frontend.
        return collection;
    }

    /**
     * @dev Rejects plain ETH transfers sent directly to the factory.
     *
     * Donations should be sent to individual Fundraiser contracts, not to this factory.
     */
    receive() external payable {
        revert("FundraiserFactory receive(): Direct ETH transfer not allowed");
    }

    /**
     * @dev Rejects calls with unknown function selectors or unrecognized calldata.
     *
     * This prevents accidental ETH transfers or incorrect function calls from being accepted silently.
     */
    fallback() external payable {
        revert("FundraiserFactory fallback(): Unknown function");
    }
}
