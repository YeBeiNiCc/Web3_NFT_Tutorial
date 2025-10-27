const { Contract, fromTwos } = require("ethers")
const {getNamedAccounts} = require ("hardhat")
module.exports = async ({getNamedAccounts,deployments}) => {
    const {cc} = await getNamedAccounts()
    const {deploy,log} =await deployments


    log("deploying the nft contract")
    await deploy("MyToken",{
        contract: "MyToken",
        from: cc,
        log: true,
        args: ["MyNFT","MNT"]
    })
    log("MyToken is deployed")
}
module.exports.tags = ["all","sourcechain"]