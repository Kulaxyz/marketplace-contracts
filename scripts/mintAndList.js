const { ethers, network } = require("hardhat")
const { moveBlocks, sleep } = require("../utils/moveBlocks")

const PRICE = ethers.utils.parseEther("0.1")

async function mintAndList() {
    const Marketplace = await ethers.getContract("Marketplace")
    const simpleNft = await ethers.getContract("SimpleNft")

    const tx = await simpleNft.mint()
    const receipt = await tx.wait(1)
    const tokenId = receipt.events[0].args.tokenId

    const approvalTx = await simpleNft.approve(Marketplace.address, tokenId)
    await approvalTx.wait(1)

    const listingTx = await Marketplace.listNft(simpleNft.address, tokenId, PRICE)
    await listingTx.wait(1)

    if (network.chainId === 31337) {
        await moveBlocks(1, 1000)
    }
}

mintAndList().then(() => {
    console.log("Minted and listed")
}).catch((error) => {
    console.error(error)
})