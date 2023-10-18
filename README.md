# Understanding Merkle Proofs in Blockchain: A Simple Guide

Merkle Proof is an essential cryptographic concept used in blockchain to ensure data integrity. To illustrate this concept, imagine a library with millions of books. Now, if someone wants to prove they have a specific book from this library without showing every book title, they'd use a Merkle Proof. This proof would be like a short list showing the section, shelf, and position of the book, leading the verifier directly to it without revealing other titles.

So, a Merkle Proof is used in scenarios where there's a need to prove that a specific piece of data exists (or doesn't exist) within a larger dataset. But that's not all there is to it. A Merkle Proof cannot exist without a Merkle Tree. When you hear them mentioned together, it's because they work in tandem: the Merkle Tree holds the data, and the Merkle Proof verifies a piece of that data. So back to our library analogy, a Merkle Tree is a catalog that lists the summary of all books.

Are you ready for a deeper dive? In this tutorial, we will explain what a Merkle Tree is and how Merkle Proofs work. So grab your favorite cup of Joe, sit back, and let's get started!


## Table of contents

1. [First, What's a "Hash"?](#first-whats-a-hash)
2. [What is Merkle Tree](#what-is-merkle-tree)
   - [Structure of a Merkle Tree](#structure-of-a-merkle-tree)
   - [Example of a Merkle Tree](#example-of-a-merkle-tree)
3. [So, What's a Merkle Proof?](#so-whats-a-merkle-proof)
   - [Structure of a Merkle Proof](#structure-of-a-merkle-proof)
4. [How Does Merkle Proofs Work?](#how-does-merkle-proofs-work)
   - [Step 1: Setting Up the Project](#step-1-setting-up-the-project)
   - [Step 2: Construct the Merkle Tree](#step-2-construct-the-merkle-tree)
   - [Step 3: Verifying with Merkle Proofs](#step-3-verifying-with-merkle-proofs)
   - [Step 4: Hashing Functions](#step-4-hashing-functions)
   - [Step 5: Execute the Code](#step-5-execute-the-code)
5. [Usecase of Merkle Trees and Merkle Proofs](#use-cases-of-merkle-trees-and-merkle-proofs)
   - [Merkle Tree](#merkle-tree-use-cases)
   - [Merkle Proofs](#merkle-proofs-use-cases)
   - [Shared Usecases](#shared-use-cases)
6. [Conclusion](#conclusion)


## First, What's a "Hash"?

To understand Merkle Proofs and Merkle Trees, you need to know about something called hashing. A hash function is like a magic math tool that takes an input (also known as a 'message') and turns it into a fixed-size string of characters. This string usually consists of numbers and letters. The key properties of a good hash function are:
- **Deterministic**: The same input will always produce the same output (hash value). So, if you hash the same data multiple times, you will get the same hash value every time.
- **Fast Computation**: It's quick to calculate the hash value for any given input. It should take very little time to compute the hash value, even for large amounts of data.
- **Pre-image Resistance**: It should be computationally infeasible to reverse the process and derive the original input from the hash value.
- **Collision Resistance**: It should be extremely unlikely for two different inputs to produce the same hash value.
- **Fixed Size**: No matter how large or small your input data is, the hash value will always be of the same length. For example, a common hash function, SHA-256, produces a 256-bit (64-character) hash value.

For example, if you take the text _"Hello, World!"_ and hash it using the SHA-256 algorithm, you'll get something like this: _"a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146"_.

## What is Merkle Tree
A Merkle Tree, also known as a hash tree, is a hierarchical data structure used to efficiently verify the integrity of large datasets. It acts like a family tree for data, where each leaf node represents a piece of data, often in the form of a hash. Non-leaf nodes are cryptographic hashes of their child nodes, ultimately leading to a single hash at the top called the **Merkle Root**. This Merkle Root serves as a concise summary of all the data below it.

The brilliance of this lies in its ability to detect any tampering or changes in the data. Even a slight modification in the data results in a significant change in the Merkle Root. To prove that an element belongs to the dataset, you only need the hashes along the branch of the tree leading to that element, not the entire tree. This forms the foundation of Merkle Proofs.

![Merkle-tree-meme](/images/merkle-tree-meme.jpeg)

### Structure of a Merkle Tree

- **Leaf Nodes**: At the bottom of the tree are the leaf nodes. Each leaf node represents a small chunk of data or a single data point. These data chunks are hashed individually.

- **Internal Nodes**: Above the leaf nodes, there are internal nodes. These nodes don't directly represent data but instead store the hash values of their child nodes. An internal node's hash is typically computed by concatenating or hashing the hash values of its children.

- **Root Node**: At the top of the tree is the root node, which is the ultimate summary of the entire dataset. It represents a single hash value, computed from the hashes of the internal nodes beneath it.

Let's look at a Merkle Tree example.

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
While a Merkle Tree provides a summarized view of data, a Merkle proof is used to prove the existence (or non-existence) to prove the existence of a specific piece of data within a larger dataset stored in a Merkle Tree without revealing the entire dataset. It's like providing evidence that a particular item is in a box without opening the box or showing its contents. This cryptographic technique enables the efficient verification of data within a larger dataset without revealing the entire dataset. 

## Structure of a Merkle Proof:
- **Leaf Nodes**: In a Merkle Tree, the individual data items (in this case, email addresses) are stored as leaf nodes at the bottom of the tree. Each leaf node is hashed (usually using a cryptographic hash function) to produce a unique hash value.
- **Intermediate Nodes**: Above the leaf nodes are intermediate nodes. These nodes are created by hashing pairs of leaf nodes. The process continues until you have a single root hash at the top of the tree.
- **Merkle Path**: A Merkle Proof consists of the path from the leaf node containing the data you want to prove (the target) up to the root node. This path includes the hashes of all the sibling nodes along the way.

## How Does Merkle Proofs Work?
Assuming we want to whitelist three email addresses but ensure they remain private. We'll use a Merkle Tree to store them securely, and Merkle Proofs to verify their inclusion without revealing all the email addresses. For this example, we'll use the `merkletreejs` library to implement the Merkle Tree.

Here's a step-by-step guide on how to do it:

### Step 1: Setting Up the Project

- Ensure that you have Node.js and npm (Node Package Manager) installed on your system. If not, you can download and install them from the official [Node.js website](https://nodejs.org/).

- Create a new directory for your project and navigate to it in your terminal:

```bash
mkdir merkle-proof-tutorial
cd merkle-proof-tutorial
```

- Initialize a new Node.js project by running the following command:

```bash
npm init -y
```

This command will generate a `package.json` file in your project directory.

- Install the `merkletreejs` library using npm:

```bash
npm install merkletreejs
```

This will download and install the library along with its dependencies.

- Create a new JavaScript file in your project directory, e.g., `merkleTreeWhitelist.js`, and open it in a code editor of your choice.

### Step 2: Construct the Merkle Tree

- At the beginning of the `merkleTreeWhitelist.js` file, import the `merkletreejs` library and Node's built-in `crypto` module:

```javascript
import { MerkleTree } from 'merkletreejs';
import crypto from 'crypto';
```

- Define the list of whitelisted email addresses in the `emailAddresses` array:

```javascript
// List of whitelisted email addresses
const emailAddresses = [
  'ama@example.com',
  'ben@example.com',
  'chris@example.com',
];
```

- For security and privacy reasons, hash the email addresses:

```javascript
const hashedAddresses = emailAddresses.map(email => Buffer.from(sha256(email), 'hex'));
```

- Next, use the hashed email addresses to create the Merkle Tree:

```javascript
// Create a Merkle Tree from the list of email addresses
const merkleTree = new MerkleTree(hashedAddresses, sha256Buffer);
```

In this step, we've created the Merkle Tree using our list of email addresses. This process involves hashing each email address to form the leaves of the tree. These leaves are then paired and hashed again to create the next layer, and this process continues until we have a single hash, known as the Merkle Root.

### Step 3: Verifying with Merkle Proofs

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

### Step 4: Hashing Functions

To ensure the security and consistency of our data, we use hashing functions to process the emails. Here, we define two hashing functions:

```javascript
function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function sha256Buffer(data) {
  return crypto.createHash('sha256').update(data).digest();
}
```

These hashing functions transform our email addresses into fixed-size strings of characters, representing the data.

### Step 5: Execute the Code

- Save the `merkleTreeWhitelist.js` file and run it using Node.js:

```bash
node merkleTreeWhitelist.js
```

You'll see the output, which will inform you whether `ama@example.com` is on the whitelist or not. Using `merklekjs`, we've built a Merkle Tree from a list of email addresses, generated a Merkle Proof for a specific email, and verified its presence. This process demonstrates how Merkle Trees provide an efficient way to prove the existence of data without revealing the entire dataset, ensuring both data integrity and privacy.

For the full source code, check out this [GitHub repository](https://github.com/fakela/merkle-proof-tutorial/).

## Use cases of Merkle Trees and Merkle Proofs
While Merkle Trees and Merkle Proofs have their distinct primary functions, they often work hand-in-hand to achieve data integrity, verification, and efficiency in various applications, most notably in blockchains and cryptographic systems.

### Merkle Tree use cases

- **Data Integrity**:  Merkle Trees, with their hierarchical structure, enable efficient verification of large sets of data. The topmost hash (Merkle root) represents a summary of all the data below it. If any piece of data changes, the Merkle root will change as well.

- **Efficiency**: They allow for efficient data verification. Instead of comparing large sets of data, one can compare just the Merkle roots.

- **Privacy**:  Merkle Trees can provide a summary (via the Merkle root) without revealing the individual data elements. This is useful in systems where privacy or data size might be a concern.

### Merkle Proofs use cases

- **Membership Verification**: Merkle Proofs allow for the verification of a specific piece of data's membership within a set, without revealing or processing the entire set. This is especially useful in systems like blockchains where a lightweight client wants to verify a particular transaction without downloading the entire blockchain.

- **Non-membership Verificatio**n: Similarly, Merkle Proofs can prove that a piece of data is not a member of a set.

- **Efficiency:** They offer a way to provide evidence of membership (or non-membership) without the need to transfer or verify large amounts of data. This is particularly useful for lightweight or resource-constrained systems.

### Shared Use cases:
In many use cases, Merkle Trees and Proofs are used together. For example, in a blockchain: 

- Merkle Trees are used to summarize all the transactions in a block, resulting in a Merkle root that is then stored in the block header.
- Merkle Proofs are used to prove the inclusion (or absence) of a specific transaction within a block without revealing all other transactions.

## Conclusion
Merkle Trees and Merkle Proofs are fundamental concepts in blockchain and data verification. They provide a powerful way to ensure data integrity and efficiently verify the existence of specific data within a large dataset. Whether you're building a blockchain application, securing data, or optimizing data synchronization, understanding Merkle Trees and Proofs is a valuable skill in the world of technology and cryptography.

![Merkle-tree-meme](/images/merkle-all-the-things.jpeg)
