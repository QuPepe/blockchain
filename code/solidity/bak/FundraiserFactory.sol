// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Fundraiser} from "./Fundraiser.sol";

/**
 * @title FundraiserFactory
 * @dev Deploys and keeps track of multiple Fundraiser contracts.
 */
contract FundraiserFactory {
    Fundraiser[] private _fundraisers;

    // SCREAMING_SNAKE_CASE for constants
    uint256 internal constant MAX_LIMIT = 20;

    event FundraiserCreated(address indexed fundraiser, address indexed owner);

    function fundraisersCount() public view returns (uint256) {
        return _fundraisers.length;
    }

    /**
     * @dev Creates a new Fundraiser contract and stores it.
     */
    function createFundraiser(
        string memory name,
        string memory url,
        string memory imageUrl, // mixedCase
        string memory description,
        address payable beneficiary
    ) public {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(bytes(name).length > 0, "Name required");

        Fundraiser fundraiser = new Fundraiser(
            name,
            url,
            imageUrl,
            description,
            beneficiary,
            msg.sender // custodian/owner
        );

        _fundraisers.push(fundraiser);

        emit FundraiserCreated(address(fundraiser), msg.sender);
    }

    /**
     * @dev 回傳部分（分頁）募資合約的地址清單
     * limit：一次最多回傳幾筆
     * offset：從第幾筆開始取
     */
    function fundraisers(
        uint256 limit,
        uint256 offset
    ) public view returns (address[] memory collection) {
        // 取得目前已建立的 Fundraiser 數量
        uint256 count = fundraisersCount();

        // 確保 offset 不超出範圍
        // 若 offset == count，代表從結尾開始取，應回傳空陣列
        require(offset <= count, "Offset out of bounds");

        // 計算實際可取出的筆數
        uint256 size = count - offset;

        // 若使用者要求的 limit 比剩餘的多，則取剩下的筆數
        if (size > limit) size = limit;

        // 設定每次查詢的最大筆數上限，避免一次取太多導致 gas 過高
        if (size > MAX_LIMIT) size = MAX_LIMIT;

        // 在 memory 中建立一個新的暫存陣列
        // 由於 storage 陣列不能直接部分回傳，所以要先複製到 memory
        collection = new address[](size);

        // 將指定範圍內的 _fundraisers 地址依序寫入 memory 陣列
        for (uint256 i = 0; i < size; i++) {
            // offset 表示「從哪一筆開始取」
            // offset + i 表示第幾筆實際要複製
            collection[i] = address(_fundraisers[offset + i]);
        }

        // 回傳結果（ABI 編碼後供外部合約或前端使用）
        return collection;
    }

    /**
     * @dev Fallback handler for receiving plain ETH transfers with no calldata.
     */
    receive() external payable {
        revert("FundraiserFactory receive(): Direct ETH transfer not allowed");
    }

    /**
     * @dev Fallback handler for receiving ETH with unrecognized calldata.
     */
    fallback() external payable {
        revert("FundraiserFactory fallback(): Unknown function");
    }
}
