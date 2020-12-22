const Auction = artifacts.require("./Auction.sol");

contract('Auction', (accounts) => {
  before(async () => {
    this.auction = await Auction.deployed(Auction, 60,20)
  })

  it('deploys successfully', async () => {
    const address = await this.auction.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  it('starting price', async () => {
    const startPrice = await this.auction.getStartPrice()
    assert.equal(startPrice.toNumber(), 20)
  })

  it('creates bid', async () => {
    const result = await this.auction.placeBid(40)
    const result2 = await this.auction.gethighestBid()
    const startPrice = await this.auction.getStartPrice()
    const bidderst = await this.auction.gettotalBidders()
   
    assert.equal(result2.toNumber(), 40)
    assert.equal(bidderst.toNumber(), 1)
    assert.notEqual(result2.toNumber(), startPrice)

  })

  it('cancel', async () => {
    const result = await this.auction.CloseAuction()
    const startPrice = await this.auction.getStartPrice()
    const result2 = await this.auction.gethighestBid()
    const cancel = await this.auction.getcanceled()
    assert.equal(startPrice.toNumber(), 0)
    assert.equal(result2.toNumber(), 0)
    assert.equal(cancel, true)

  })

})