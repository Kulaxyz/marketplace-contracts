pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SimpleNft is ERC721 {
    uint256 private s_counter;

    mapping(uint256 => string) private s_tokenURIs;
//    string public constant URI = "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";

    constructor() ERC721("Doge", "DOG") {}

    function mint(string memory url) public {
        s_counter++;
        s_tokenURIs[s_counter] = url;
        _safeMint(msg.sender, s_counter);
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        return s_tokenURIs[_tokenId];
    }

    function getCounter() public view returns (uint256) {
        return s_counter;
    }
}
