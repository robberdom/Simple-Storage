const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

describe("SimpleStorage", function () {
    let SimpleStorage, SimpleStorageFactory
    beforeEach(async function () {
        SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        SimpleStorage = await SimpleStorageFactory.deploy()
    })
    it("Should start with a favourite number of 0", async function () {
        const currentValue = await SimpleStorage.retrieve()
        const expectedOutcome = "0"

        assert.equal(currentValue.toString(), expectedOutcome)
    })

    it("Should update favourite number to 30.", async function () {
        const expectedOutcome = "30"
        const txResponse = await SimpleStorage.store(30)
        await txResponse.wait(1)
        const updatedCurrentValue = await SimpleStorage.retrieve()
        assert.equal(updatedCurrentValue.toString(), expectedOutcome)
    })
})
