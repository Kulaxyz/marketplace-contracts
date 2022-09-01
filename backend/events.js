const ethers = require('ethers');

const address = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const abi = [
    {
        "inputs": [],
        "name": "Marketplace__AlreadyListed",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "Marketplace__NoMoney",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Marketplace__NotApproved",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "actualPrice",
                "type": "uint256"
            }
        ],
        "name": "Marketplace__NotEnoughMoney",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "Marketplace__NotListed",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Marketplace__OwnerCantBuy",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "Marketplace__PriceCannotBeZero",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "Marketplace__WithdrawFailed",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "nftAddress",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "ListingAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "nftContract",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ListingCancelled",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "nftContract",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newPrice",
                "type": "uint256"
            }
        ],
        "name": "ListingPriceUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "nftContract",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "NftBought",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "nftContractAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "buyNft",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "nftContractAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "cancelListing",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "nftContractAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "listNft",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "nftContractAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "newPrice",
                "type": "uint256"
            }
        ],
        "name": "updateListingPrice",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    port     : 3306,
    user     : 'root',
    password : '7B5aIZRI1Lg8tPPJB',
    database : 'liveDb'
});

connection.connect();

async function main() {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(address, abi, provider);

    const wallet = new ethers.Wallet(privateKey, provider);

    const contractWithSigner = contract.connect(wallet);

    contractWithSigner.on("ListingAdded", (nftContractAddress, tokenId, price, event) => {
        // console.log("ListingAdded", nftContractAddress, tokenId.toString(), price.toString());
        // console.log("Event hash: ", event.transactionHash);

    //     CREATE TABLE IF NOT EXISTS `listing_added`
    //     (
    //         `hash` varchar(255) NOT NULL,
    //         `token_id`     varchar(255)     NOT NULL,
    //         `price`   int(64)         NOT NULL,
    //         `address` varchar(255)  NOT NULL,
    //         PRIMARY KEY (token_id, address)
    // ) ENGINE = InnoDB
    //     DEFAULT CHARSET = utf8mb4;

        connection.query('INSERT INTO listing_added SET ? ON DUPLICATE KEY UPDATE price=VALUES(price)', {
            hash: event.transactionHash,
            token_id: tokenId,
            price: price,
            address: nftContractAddress
        }, function (error, results, fields) {
            if (error) throw error;
            console.log(results.insertId);
        });

        // connection.query('INSERT INTO active_listings SET ?', {
        //     hash: event.transactionHash,
        //     token_id: tokenId,
        //     price: price,
        //     address: nftContractAddress
        // }, function (error, results, fields) {
        //     if (error) throw error;
        //     console.log(results.insertId);
        // });
    })

    contractWithSigner.on("ListingCancelled", (nftContractAddress, tokenId, event) => {
        // console.log("ListingCancelled", nftContractAddress, tokenId.toString());
        // console.log("Event hash: ", event.transactionHash);
        connection.query('INSERT INTO listing_cancelled SET ?', {
            hash: event.transactionHash,
            token_id: tokenId,
            address: nftContractAddress
        }, function (error, results, fields) {
            if (error) throw error;
            console.log(results.insertId);
        }).on('error', function(err) {
            console.log(err);
        });

        connection.query(
            'DELETE FROM active_listings WHERE token_id = ? AND address = ?',
            [tokenId, nftContractAddress],
            function (error, results, fields) {
                if (error) throw error;
                console.log(results.affectedRows);
        });
    })
    // address indexed buyer, address indexed nftContract, uint256 indexed tokenId, uint256 price
    contractWithSigner.on("NftBought", (buyer, nftContract, tokenId, price, event) => {
        // console.log("NftBought", buyer, nftContract, tokenId.toString(), price.toString());
        connection.query('INSERT INTO nft_bought SET ?', {
            hash: event.transactionHash,
            buyer: buyer,
            nft_contract: nftContract,
            token_id: tokenId,
            price: price
        });

        connection.query(
            'DELETE FROM active_listings WHERE token_id = ? AND address = ?',
            [tokenId, nftContractAddress],
            function (error, results, fields) {
                if (error) throw error;
                console.log(results.affectedRows);
            });
    })

    contractWithSigner.on("ListingPriceUpdated", (nftContractAddress, tokenId, newPrice, event) => {
        connection.query('INSERT INTO listing_price_updated SET ?', {
            hash: event.transactionHash,
            token_id: tokenId,
            new_price: newPrice,
            address: nftContractAddress
        });

        connection.query("UPDATE active_listings SET price = ? WHERE token_id = ? AND address = ?",
            [newPrice, tokenId, nftContractAddress],
            function (error, results, fields) {
            if (error) throw error;
            console.log(results.affectedRows);
        });
    })
}

main().catch(() => {
    connection.end();
});
