const { getNamedAccounts, deployments, ethers } = require("hardhat")
const { expect } = require("chai")

let cc
let nft
let wnft
let poolLnU
let poolMnB
let chainSelector

before(async function(){
    cc = (await getNamedAccounts()).cc
    await deployments.fixture(["all"])
    nft = await ethers.getContract("MyToken", cc)
    wnft = await ethers.getContract("WrappedNFT", cc)
    poolLnU = await ethers.getContract("NFTPoolLockAndRelease", cc)
    poolMnB = await ethers.getContract("NFTPoolBurnAndMint", cc)
    ccipLocalSimulator = await ethers.getContract("CCIPLocalSimulator", cc)
    chainSelector = (await ccipLocalSimulator.configuration()).chainSelector_
})

describe("test if the nft can be minted successfully", 
    async function(){
        it("test if the owner of nft is minter", 
            async function(){
                // get nft
                await nft.safeMint(cc)
                // check the owner
                const ownerOfNft = await nft.ownerOf(0)
                expect(ownerOfNft).to.equal(cc)
            })
    })

describe("test if the nft can be locked and transferred to destchain"
    , async function() {
        // transfer NFT from source chain to dest chain, check if the nft is locked
        it("transfer NFT from source chain to dest chain, check if the nft is locked",
            async function() {
                await ccipLocalSimulator.requestLinkFromFaucet(poolLnU.target, ethers.parseEther("10"))

                
                // lock and send with CCIP
                await nft.approve(poolLnU.target, 0)
                await poolLnU.lockAndSendNFT(0, cc, chainSelector, poolMnB.target)
                
                // check if owner of nft is pool's address
                const newOwner = await nft.ownerOf(0)
                console.log("test")
                expect(newOwner).to.equal(poolLnU.target)
            }
        )
        // check if the wnft is owned by new owner
        it("check if wnft's account is owner", 
            async function() {
                const newOwner = await wnft.ownerOf(0)
                expect(newOwner).to.equal(cc)
            }
        )
    }
)

describe("test if the nft can be burned and transferred back to sourcechain", 
    async function() {
        it("wnft can be burned", 
            async function() {
                // fund some Link tokens
                ccipLocalSimulator.requestLinkFromFaucet(poolMnB.target, ethers.parseEther("10"))
                
                // grant permission
                await wnft.approve(poolMnB.target, 0)

                // transfer the token
                await poolMnB.burnAndMint(0, cc, chainSelector, poolLnU.target)
                const wnftTotalSupply = await wnft.totalSupply()
                expect(wnftTotalSupply).to.equal(0)
            }
        )
        it("owner of the NFT is transferred to cc",
            async function() {
                const newOwner = await nft.ownerOf(0)
                expect(newOwner).to.equal(cc)
            }
        )
    }
)