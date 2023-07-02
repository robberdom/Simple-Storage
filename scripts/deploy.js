const { ethers, run, network } = require("hardhat")
require("dotenv").config()

async function main() {
    const [deployer] = await ethers.getSigners() //gets the msg.sender account

    console.log("Deploying contracts with the account:", deployer.address) //returns it
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying, please wait...")

    const SimpleStorage = await SimpleStorageFactory.deploy() //this is where the deployment happens.
    await SimpleStorage.waitForDeployment() //used to wait for the deployment of the contract before proceeding with the execution of the subsequent code.

    console.log(
        `The contract has been deployed to: ${await SimpleStorage.getAddress()}`
    )
    console.log(process.env.ETHERSCAN_API_KEY)
    if (
        network.config.chainId === "11155111" &&
        process.env.ETHERSCAN_API_KEY
    ) {
        console.log("Wait a moment as we wait for block confirmations...")
        await SimpleStorage.wait(6)
        await verify(await SimpleStorage.address(), [])
    }

    const currentValue = await SimpleStorage.retrieve()
    console.log(`Current value is ${currentValue}`)

    const txResponse = await SimpleStorage.store(30)
    await txResponse.wait(1)

    const updatedCurrentValue = await SimpleStorage.retrieve()
    console.log(`Updated value is ${updatedCurrentValue}`)
}

async function verify(contractAddress) {
    console.log("Verifying, please wait...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            network: network.name,
            constructorArguments: [],
        })
        console.log("Contract successfully verified!")
    } catch (e) {
        if (e.message.includes("Contract source code already verified")) {
            console.log("Contract already verified.")
        } else {
            console.log("Verification failed:", e)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
