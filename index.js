#!/usr/bin/env node

import inquirer from "inquirer";
import { ThirdwebSDK } from '@thirdweb-dev/sdk/solana';
import { readFileSync } from 'fs';
import chalkAnimation from "chalk-animation";
import pkg from "stability-client";
const { generateAsync } = pkg;

import * as dotenv from "dotenv";
dotenv.config();

let playerName;
let location;
let address;



const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow(
    "Genereate NFTs from text using Stable diffusion \n"
  );

  await sleep();
  rainbowTitle.stop();
}

async function askName() {
  const answers = await inquirer.prompt({
    name: "player_name",
    type: "input",
    message: "Enter prompt",
    default() {
      return "Player";
    },
  });

  playerName = answers.player_name;
}

async function getImages() {
  const { images } = await generateAsync({
    prompt: `${playerName}`,
    apiKey: process.env.DREAMSTUDIO_API_KEY,
  });
   location=images[0]["filePath"];
}
async function askAddress() {
  const answers = await inquirer.prompt({
    name: "Address",
    type: "input",
    message: "Enter address you want NFT to be minted",
    default() {
      return "address";
    },
  });
  address = answers.Address;
}
async function main() {

    const NETWORK = "devnet";
    const sdk = ThirdwebSDK.fromPrivateKey(NETWORK, process.env.WALLET_PRIVATE_KEY);
  
    const nftCollection = await sdk.getNFTCollection('F9PEjMTJobZv9qpgbVqZrGXLpKqbwQFbqKHpXfLNyExN');
  
    const nft = await nftCollection.mintTo(address, {
      name: "AI generated NFT",
      description: `${playerName}`,
      symbol: "SNFT",
      image:readFileSync(location)
    });
    console.log(`https://solscan.io/token/${nft}?cluster=devnet`)
  }

console.clear();
await welcome();

await askName();
await getImages();
await askAddress();
await main();
