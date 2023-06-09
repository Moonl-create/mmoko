const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("ERC721 tests", function () {
  const tokenId = 33;
  let signers;
  let erc721;

  before(async function () {
    signers = await ethers.getSigners();

    const factory = await ethers.getContractFactory('contracts/erc-721/ERC721Mock.sol:ERC721Mock');
    erc721 = await factory.deploy('tokenName', 'TOKENSYMBOL');
    await erc721.mint(signers[0].address, tokenId);
  });

  it("should be able to execute name()", async function () {
    const res = await erc721.name();
    expect(res).to.equal('tokenName');
  });

  it("should be able to execute symbol()", async function () {
    const res = await erc721.symbol();
    expect(res).to.equal('TOKENSYMBOL');
  });

  it("should be able to execute balanceOf(address)", async function () {
    const res = await erc721.balanceOf(signers[0].address);
    expect(res).to.eq(1);
  });

  it("should be able to execute ownerOf(uint256)", async function () {
    const res = await erc721.ownerOf(tokenId);
    expect(res).to.eq(signers[0].address);
  });

  it("should be able to execute approve(address,uint256)", async function () {
    const res = await erc721.approve(signers[1].address, tokenId);
    expect((await res.wait()).events.filter(e => e.event === 'Approval')).to.not.be.empty;
  });

  it("should be able to execute getApproved(uint256)", async function () {
    const res = await erc721.getApproved(tokenId);
    expect(res).to.eq(signers[1].address);
  });

  it("should be able to execute setApprovalForAll(address,bool)", async function () {
    const res = await erc721.setApprovalForAll(signers[1].address, true);
    expect((await res.wait()).events.filter(e => e.event === 'ApprovalForAll')).to.not.be.empty;
  });

  it("should be able to execute isApprovedForAll(address,address)", async function () {
    const res = await erc721.isApprovedForAll(signers[0].address, signers[1].address);
    expect(res).to.eq(true);
  });

  it("should be able to execute transferFrom(address,address,uint256)", async function () {
    const ownerBefore = await erc721.ownerOf(tokenId);
    await erc721.transferFrom(signers[0].address, signers[1].address, tokenId);
    const ownerAfter = await erc721.ownerOf(tokenId);
    expect(ownerBefore).to.not.eq(ownerAfter);
    expect(ownerAfter).to.eq(signers[1].address);
  });
});
