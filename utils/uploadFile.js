const pinataSDK = require("@pinata/sdk")
const fs = require("fs")
const path = require("path")

// PINATA_API_KEY=32f3951ba2ca7c4ff1b3
// PINATA_API_SECRET=1ba2b959bf2665d8694e84ec6bb7ed6d9711185d53d7095d52a173ff63440e5e

const pinataApiKey = process.env.PINATA_API_KEY || "32f3951ba2ca7c4ff1b3"
const pinataApiSecret = process.env.PINATA_API_SECRET || "1ba2b959bf2665d8694e84ec6bb7ed6d9711185d53d7095d52a173ff63440e5e"
console.log(pinataApiSecret, pinataApiKey)
const pinata = pinataSDK(pinataApiKey, pinataApiSecret)

async function storeImages(files) {
    let responses = []
    for (let fileIndex in files) {
        const readableStreamForFile = fs.createReadStream(files.image[0].path);
        try {
            const response = await pinata.pinFileToIPFS(readableStreamForFile)
            responses.push(response)
        } catch (error) {
            console.log(error)
        }
    }
    return { responses, files }
}

async function storeTokenUriMetadata(metadata) {
    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (error) {
        console.log(error)
    }
    return null
}

module.exports = { storeImages, storeTokenUriMetadata }