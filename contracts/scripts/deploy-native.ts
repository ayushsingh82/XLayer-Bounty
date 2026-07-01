import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const NativeEscrow = await ethers.getContractFactory("BountyEscrowNative");
  const escrow = await NativeEscrow.deploy(deployer.address);
  await escrow.waitForDeployment();

  const escrowAddress = await escrow.getAddress();
  console.log("BountyEscrowNative deployed at:", escrowAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

