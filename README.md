# Understanding Merkle Proofs in Blockchain: A Simple Guide

Imagine you have a gigantic pile of data, like a long list of transactions in a blockchain or a huge database of user records. Now, picture yourself trying to find out if a specific item exists in this massive heap. The typical way to do this is by sifting through everything, which is not only slow but also inefficient. However, there's a clever solution called Merkle Proofs that can make this process super quick and secure. _These proofs are named after Ralph Merkle, who came up with the concept in 1979._

In this tutorial, we're going to break down the idea of Merkle Trees and how they help create and validate Merkle Proofs. So grab your favorite cup of joe, sit back, and let's get started!

## First, What's a "Hash"?

To understand Merkle Proofs and Merkle Trees, you need to know about something called hashing. A hash function is like a magic math tool that takes an input (also known as a 'message') and turns it into a fixed-size string of characters. This string usually consists of numbers and letters. The key properties of a good hash function are:
- Deterministic: The same input will always produce the same output (hash value). So, if you hash the same data multiple times, you will get the same hash value every time.
- Fast Computation: It's quick to calculate the hash value for any given input. It should take very little time to compute the hash value, even for large amounts of data.
- Pre-image Resistance: It should be computationally infeasible to reverse the process and derive the original input from the hash value.
- Collision Resistance: It should be extremely unlikely for two different inputs to produce the same hash value.
- Fixed Size: No matter how large or small your input data is, the hash value will always be of the same length. For example, a common hash function, SHA-256, produces a 256-bit (64-character) hash value.

For example, if you take the text _"Hello, World!"_ and hash it using the SHA-256 algorithm, you'll get something like this: _"a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146"_.

## What is Merkle Tree
A Merkle Tree, sometimes called a hash tree or binary hash tree, is like a family tree for data. A Merkle Tree is a hierarchical tree-like data structure composed of hash values, often used to efficiently summarize and verify the integrity of a large dataset. It is designed to help us prove that a specific piece of data belongs to a larger dataset without having to deal with all the data.

![Merkle-tree-meme](/images/merkle-tree-meme.jpeg)

### Structure of a Merkle Tree

- **Leaf Nodes**: At the bottom of the tree are the leaf nodes. Each leaf node represents a small chunk of data or a single data point. These data chunks are hashed individually.

- **Internal Nodes**: Above the leaf nodes, there are internal nodes. These nodes don't directly represent data but instead store the hash values of their child nodes. An internal node's hash is typically computed by concatenating or hashing the hash values of its children.

- **Root Node**: At the top of the tree is the root node, which is the ultimate summary of the entire dataset. It represents a single hash value, computed from the hashes of the internal nodes beneath it.

Let's look at a Merkle Tree example

### Example of a Merkle Tree:

Let's say we have a dataset with four pieces of data: A, B, C, and D. We'll construct a Merkle Tree for this dataset:

```
                RootHash
               /        \
           Hash5        Hash6
          /    \        /    \
      Hash1   Hash2  Hash3   Hash4
       |       |      |       |
       A       B      C       D
```

In this diagram:

- Leaf nodes (bottom) represent the individual data points (A, B, C, D).
- Internal nodes (in the middle) represent the hashes of their child nodes.
- The root node (at the top) represents the ultimate summary of the entire dataset, which is the RootHash.

This structure allows for efficient verification of data integrity by comparing hashes at different levels of the tree. If any part of the dataset changes, it will affect the hashes of the internal nodes, and ultimately, the RootHash, making it easy to detect tampering or discrepancies.


## So, What's a Merkle Proof?
Now that we've covered Merkle Trees, let's look at what Merkle proof is. A Merkle proof is a cryptographic technique used to prove the existence (or non-existence) to prove the existence of a specific piece of data within a larger dataset stored in a Merkle Tree without revealing the entire dataset. It is a method for efficient data verification. It's like providing evidence that a particular item is in a box without opening the box or showing its contents. This cryptographic technique that enables the efficient verification of data within a larger dataset without revealing the entire dataset. 

## Structure of a Merkle Proof:
- **Leaf Nodes**: In a Merkle Tree, the individual data items (in this case, email addresses) are stored as leaf nodes at the bottom of the tree. Each leaf node is hashed (usually using a cryptographic hash function) to produce a unique hash value.
- **Intermediate Nodes**: Above the leaf nodes are intermediate nodes. These nodes are created by hashing pairs of leaf nodes. The process continues until you have a single root hash at the top of the tree.
- **Merkle Path**: A Merkle Proof consists of the path from the leaf node containing the data you want to prove (the target) up to the root node. This path includes the hashes of all the sibling nodes along the way.

## How Do Merkle Proofs Work?
Imagine you're building a decentralized application (DApp) where you want to grant access only to users with specific email addresses. To efficiently manage access control, you can use a Merkle Tree to whitelist email addresses. For this example, we'll use the merkle-tree-solidity library to implement the Merkle Tree.

Here's how you can do it:
- Before we start, make sure you have Node.js and npm (Node Package Manager) installed on your system. You can download and install Node.js from the official [website] (https://nodejs.org/)

- Create a new directory for your project and navigate to it in your terminal:

```bash
mkdir merkle-proof-tutorial
cd merkle-proof-tutorial
```

- Initialize a new Node.js project by running the following command:

```bash
npm init -y
```

This command will create a `package.json` file in your project directory.

- Install the `merkle-tree-solidity` library using npm:

```bash
npm install merkle-tree-solidity
```

This will download and install the library and its dependencies.

- Create a new JavaScript file in your project directory, e.g., `merkleTreeWhitelist.js`, and open it in a code editor of your choice.

In your js file add the following code below

- Import the `merkletreejs` and the  Node's built-in`crypto` modulelibrary at the beginning of the file.

```javascript
import { MerkleTree } from 'merkletreejs';
import crypto from 'crypto';
```

- Define the list of whitelisted email addresses in the `emailAddresses` array.

```javascript
// List of whitelisted email addresses
const emailAddresses = [
  'ama@example.com',
  'ben@example.com',
  'chris@example.com',
];
```

- For security and privacy, hash the email addresses:

```javascript
const hashedAddresses = emailAddresses.map(email => Buffer.from(sha256(email), 'hex'));
```

- Next, use the hashed email addresses to create the Merkle Tree:

```javascript
// Create a Merkle Tree from the list of email addresses
const merkleTree = new MerkleTree(hashedAddresses, sha256Buffer);
```

- Now, you can verify if an email address is on your whitelist. For example, let's check if `ama@example.com` is on the whitelist:

```javascript
const targetEmail = 'ama@example.com';
const hashedTargetEmail = Buffer.from(sha256(targetEmail), 'hex');
```

- Check if the hashed email exists in your list, generate a Merkle Proof if it does, and then verify its authenticity:


```javascript
const targetIndex = hashedAddresses.indexOf(hashedTargetEmail);

if (targetIndex === -1) {
  console.log(`Email address "${targetEmail}" is not on the whitelist.`);
} else {
  const proof = merkleTree.getProof(hashedTargetEmail);
  const isProofValid = merkleTree.verify(proof, hashedTargetEmail, merkleTree.getRoot());

  if (isProofValid) {
    console.log(`Email address "${targetEmail}" is on the whitelist.`);
  } else {
    console.log(`Email address "${targetEmail}" is not on the whitelist.`);
  }
}
```
- Lastly, define two hashing functions:

```javascript
function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function sha256Buffer(data) {
  return crypto.createHash('sha256').update(data).digest();
}
```

- Save the `merkleTreeWhitelist.js` file and run it using Node.js:

```bash
node merkleTreeWhitelist.js
```

You'll see the output, which will tell you whether `ama@example.com` is on the whitelist or not.

![whitelist-output](/images/whitelist.png)


This above code example demonstrates the entire process of setting up, creating a Merkle Tree, generating a Merkle Proof, and verifying the proof for whitelisting email addresses in a web3 application.


## Merkle Trees vs. Merkle Proofs
Wile Merkle trees and Merkle proofs have their distinct primary functions, they often work hand-in-hand to achieve data integrity, verification, and efficiency in various applications, most notably in blockchains and cryptographic systems.

- **Data Integrity**: Merkle trees, with their hierarchical structure, enable efficient verification of large sets of data. The topmost hash (Merkle root) represents a summary of all the data below it. If any piece of data changes, the Merkle root will change as well.

- **Efficiency**: They allow for efficient data verification. Instead of comparing large sets of data, one can compare just the Merkle roots.

- **Privacy**: Merkle trees can provide a summary (via the Merkle root) without revealing the individual data elements. This is useful in systems where privacy or data size might be a concern.

**Merkle Proofs**

- **Membership Verification**: Merkle proofs allow for the verification of a specific piece of data's membership within a set, without revealing or processing the entire set. This is especially useful in systems like blockchains where a lightweight client wants to verify a particular transaction without downloading the entire blockchain.

- **Non-membership Verificatio**n: Similarly, Merkle proofs can prove that a piece of data is not a member of a set.

- **Efficiency:** They offer a way to provide evidence of membership (or non-membership) without the need to transfer or verify large amounts of data. This is particularly useful for lightweight or resource-constrained systems.

### Shared Usecases:
In many use-cases, Merkle trees and proofs are used together. For example, in a blockchain: 

- Merkle Trees are used to summarize all the transactions in a block, resulting in a Merkle root that is then stored in the block header.
- Merkle Proofs are used to prove the inclusion (or absence) of a specific transaction within a block without revealing all other transactions.


## Conclusion
Merkle Trees and Merkle Proofs are fundamental concepts in blockchain and data verification. They provide a powerful way to ensure data integrity and efficiently verify the existence of specific data within a large dataset. Whether you're building a blockchain application, securing data, or optimizing data synchronization, understanding Merkle Trees and Proofs is a valuable skill in the world of technology and cryptography.

![Merkle-tree-meme](/images/merkle-all-the-things.jpeg)
