const {storeTokenUriMetadata} = require("./uploadFile");

async function getUris(imageUploadResponses, files, name, description) {
    const metadataTemplate = {
        name: "",
        description: "",
        image: "",
        attributes: [],
    }

    let tokenUris = []
    for (let imageUploadResponseIndex in imageUploadResponses) {
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = name
        tokenUriMetadata.description = description
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name}...`)
        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    return tokenUris[0]
}

module.exports = getUris