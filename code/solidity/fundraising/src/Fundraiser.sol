// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Fundraiser
 * @dev Manages one decentralized fundraising campaign.
 *
 * The contract stores campaign metadata, records donations by donor address,
 * keeps aggregate donation statistics, and allows the owner to withdraw the
 * collected ETH to a designated beneficiary.
 */
contract Fundraiser is Ownable {
    // Basic campaign metadata displayed by the frontend or external applications.
    string public name;
    string public url;
    string public imageUrl;
    string public description;

    // Address that receives the collected ETH when the owner withdraws funds.
    address payable public beneficiary;

    /**
     * @dev Represents one donation made by a donor.
     * @param value Amount donated, measured in wei.
     * @param date Block timestamp when the donation was recorded.
     */
    struct Donation {
        uint256 value;
        uint256 date;
    }

    // Stores each donor's donation history.
    // The key is the donor address; the value is an array of Donation records.
    mapping(address => Donation[]) private _donations;

    // Total amount of ETH received by this fundraiser, measured in wei.
    uint256 public totalDonations;

    // Total number of successful donation transactions.
    uint256 public donationsCount;

    /**
     * @dev Emitted whenever ETH is donated to the fundraiser.
     * @param donor Address that made the donation.
     * @param value Amount donated, measured in wei.
     */
    event DonationReceived(address indexed donor, uint256 value);

    /**
     * @dev Emitted when the owner successfully withdraws funds to the beneficiary.
     * @param amount Amount withdrawn, measured in wei.
     */
    event Withdraw(uint256 amount);

    /**
     * @dev Initializes a new fundraising campaign.
     *
     * The deploying address is initially set as the owner by Ownable, then
     * ownership is transferred to `_custodian`. In a factory pattern, the
     * deployer is usually the factory contract, while the custodian is the EOA
     * or account that should manage this fundraiser.
     *
     * @param _name Name of the fundraiser.
     * @param _url Website or reference URL for the campaign.
     * @param _imageUrl Image URL representing the campaign.
     * @param _description Human-readable campaign description.
     * @param _beneficiary Address that will receive withdrawn funds.
     * @param _custodian Address that will become the owner of this contract.
     */
    constructor(
        string memory _name,
        string memory _url,
        string memory _imageUrl,
        string memory _description,
        address payable _beneficiary,
        address _custodian
    ) Ownable(msg.sender) {
        // The owner/custodian must be a valid non-zero address.
        require(_custodian != address(0), "Invalid custodian address");

        // Store the campaign metadata and beneficiary address.
        name = _name;
        url = _url;
        imageUrl = _imageUrl;
        description = _description;
        beneficiary = _beneficiary;

        // Transfer ownership from the deployer to the designated custodian.
        transferOwnership(_custodian);
    }

    /**
     * @dev Updates the beneficiary address.
     *
     * Only the owner can change where withdrawn funds are sent.
     *
     * @param _beneficiary New beneficiary address.
     */
    function setBeneficiary(address payable _beneficiary) public onlyOwner {
        beneficiary = _beneficiary;
    }

    /**
     * @dev Returns the number of donations made by the caller.
     *
     * This function only reports the donation count for `msg.sender`, not for
     * all donors.
     */
    function myDonationsCount() public view returns (uint256) {
        return _donations[msg.sender].length;
    }

    /**
     * @dev Returns the caller's complete donation history.
     *
     * Solidity cannot directly return an array of structs conveniently for all
     * frontend tooling, so this function returns two parallel arrays:
     * donation values and donation timestamps.
     *
     * @return values Donation amounts, measured in wei.
     * @return dates Block timestamps for each donation.
     */
    function myDonations()
        public
        view
        returns (uint256[] memory values, uint256[] memory dates)
    {
        // Read the caller's donation records from storage.
        Donation[] storage donations = _donations[msg.sender];
        uint256 count = donations.length;

        // Allocate memory arrays for the return values.
        values = new uint256[](count);
        dates = new uint256[](count);

        // Copy each donation record from storage into the return arrays.
        for (uint256 i = 0; i < count; i++) {
            values[i] = donations[i].value;
            dates[i] = donations[i].date;
        }

        return (values, dates);
    }

    /**
     * @dev Withdraws all ETH held by this contract to the beneficiary.
     *
     * Requirements:
     * - Only the owner can call this function.
     * - The contract balance must be greater than zero.
     * - The ETH transfer to the beneficiary must succeed.
     *
     * Emits a {Withdraw} event on success.
     */
    function withdraw() public onlyOwner {
        // Read the current ETH balance of this contract.
        uint256 balance = address(this).balance;

        // Prevent empty withdrawals.
        require(balance > 0, "No funds available");

        // Send the entire contract balance to the beneficiary using a low-level call.
        // `success` indicates whether the ETH transfer completed successfully.
        (bool success, ) = beneficiary.call{value: balance}("");

        // Revert the whole transaction if the transfer failed.
        require(success, "Withdrawal failed");

        // Notify off-chain applications that funds were withdrawn.
        emit Withdraw(balance);
    }

    /**
     * @dev Records a donation in storage and updates aggregate statistics.
     *
     * This internal helper is used by both `donate()` and `receive()` so that
     * explicit donations and plain ETH transfers are handled consistently.
     *
     * @param donor Address that sent the donation.
     * @param amount Donation amount, measured in wei.
     */
    function _recordDonation(address donor, uint256 amount) internal {
        // Reject zero-value donations.
        require(amount > 0, "Donation must be greater than 0");

        // Append a new donation record to the donor's history.
        _donations[donor].push(
            Donation({value: amount, date: block.timestamp})
        );

        // Update aggregate campaign statistics.
        totalDonations += amount;
        donationsCount++;

        // Notify off-chain applications that a donation was received.
        emit DonationReceived(donor, amount);
    }

    /**
     * @dev Allows users to donate ETH through an explicit function call.
     *
     * The donated ETH is available as `msg.value`.
     */
    function donate() public payable {
        _recordDonation(msg.sender, msg.value);
    }

    /**
     * @dev Handles plain ETH transfers sent without calldata.
     *
     * Example: sending ETH directly to the contract address from a wallet.
     */
    receive() external payable {
        _recordDonation(msg.sender, msg.value);
    }

    /**
     * @dev Rejects calls with unknown function selectors or unexpected calldata.
     *
     * This prevents users or contracts from accidentally sending ETH with
     * unrecognized calldata and assuming it was treated as a normal donation.
     */
    fallback() external payable {
        revert("Fundraiser fallback(): Unknown function");
    }
}
