async function main() {
    const candidateNames = ["Alice", "Bob", "Charlie"];
    const durationInMinutes = 10;
  
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy(candidateNames, durationInMinutes);
  
    await voting.waitForDeployment();
  
    console.log("Voting contract deployed to:", await voting.getAddress());
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  