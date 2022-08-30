// SPDX-Licence-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error Marketplace__AlreadyListed();
error Marketplace__NotListed();
error Marketplace__PriceCannotBeZero();
error Marketplace__NotApproved(uint256 tokenId);
error Marketplace__OwnerCantBuy(uint256 tokenId);
error Marketplace__NotEnoughMoney(uint256 tokenId, uint256 actualPrice);
error Marketplace__WithdrawFailed();
error Marketplace__NoMoney();

contract Marketplace is ReentrancyGuard {
    struct Listing {
        uint256 price;
        address seller;
    }
    // NFT Contract addess -> tokenId -> Listing
    mapping(address => mapping(uint256 => Listing)) private s_listings;

    // User address -> balance
    mapping(address => uint256) private s_balances;

    event ListingAdded(address indexed nftAddress, uint256 indexed tokenId, uint256 price);
    event NftBought(address indexed buyer, address indexed nftContract, uint256 indexed tokenId, uint256 price);
    event ListingCancelled(address indexed nftContract, uint256 indexed tokenId);
    event ListingPriceUpdated(address indexed nftContract, uint256 indexed tokenId, uint256 newPrice);

    modifier notListed(address nftContract, uint256 tokenId) {
        if (s_listings[nftContract][tokenId].price != 0) {
            revert Marketplace__AlreadyListed();
        }
        _;
    }

    modifier onlyListed(address nftContract, uint256 tokenId) {
        if (s_listings[nftContract][tokenId].price <= 0) {
            revert Marketplace__NotListed();
        }
        _;
    }

    modifier onlyNftOwner(address nftContractAddress, uint256 tokenId, address owner) {
        IERC721 nftContract = IERC721(nftContractAddress);
        if (nftContract.ownerOf(tokenId) != owner) {
            revert Marketplace__NotApproved(tokenId);
        }
        _;
    }

    modifier notNftOwner(address nftContractAddress, uint256 tokenId, address owner) {
        IERC721 nftContract = IERC721(nftContractAddress);
        if (nftContract.ownerOf(tokenId) == owner) {
            revert Marketplace__OwnerCantBuy(tokenId);
        }
        _;
    }

    function listNft(address nftContractAddress, uint256 tokenId, uint256 price)
    external
    notListed(nftContractAddress, tokenId)
    onlyNftOwner(nftContractAddress, tokenId, msg.sender)
    {
        if (price == 0) {
            revert Marketplace__PriceCannotBeZero();
        }

        IERC721 nftContract = IERC721(nftContractAddress);

        if (nftContract.getApproved(tokenId) != address(this)) {
            revert Marketplace__NotApproved(tokenId);
        }
        s_listings[nftContractAddress][tokenId] = Listing(price, msg.sender);

        emit ListingAdded(nftContractAddress, tokenId, price);
    }

    function buyNft(address nftContractAddress, uint256 tokenId)
    external
    payable
    notNftOwner(nftContractAddress, tokenId, msg.sender)
    {
        IERC721 nftContract = IERC721(nftContractAddress);
        if (nftContract.getApproved(tokenId) != address(this)) {
            revert Marketplace__NotApproved(tokenId);
        }
        Listing memory listing = s_listings[nftContractAddress][tokenId];
        if (listing.price > msg.value) {
            revert Marketplace__NotEnoughMoney(tokenId, listing.price);
        }
        s_balances[listing.seller] += listing.price;
        delete(s_listings[nftContractAddress][tokenId]);
        nftContract.safeTransferFrom(listing.seller, msg.sender, tokenId);

        emit NftBought(msg.sender, nftContractAddress, tokenId, listing.price);
    }

    function withdraw() external nonReentrant() {
        uint256 balance = s_balances[msg.sender];
        if (balance > 0) {
            revert Marketplace__NoMoney();
        }
        s_balances[msg.sender] = 0;
        (bool success,) = payable(msg.sender).call{value: balance}("");
        if (!success) {
            revert Marketplace__WithdrawFailed();
        }
    }

    function cancelListing(address nftContractAddress, uint256 tokenId)
    external
    onlyListed(nftContractAddress, tokenId)
    onlyNftOwner(nftContractAddress, tokenId, msg.sender)
    {
        delete(s_listings[nftContractAddress][tokenId]);
        emit ListingCancelled(nftContractAddress, tokenId);
    }

    function updateListingPrice(address nftContractAddress, uint256 tokenId, uint256 newPrice)
    external
    onlyListed(nftContractAddress, tokenId)
    onlyNftOwner(nftContractAddress, tokenId, msg.sender)
    {
        if (newPrice == 0) {
            revert Marketplace__PriceCannotBeZero();
        }
        s_listings[nftContractAddress][tokenId].price = newPrice;
        emit ListingPriceUpdated(nftContractAddress, tokenId, newPrice);
    }
}