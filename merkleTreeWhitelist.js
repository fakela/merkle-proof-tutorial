import { MerkleTree } from 'merkletreejs';
import crypto from 'crypto';

// List of whitelisted email addresses
const emailAddresses = [
  'ama@example.com',
  'ben@example.com',
  'chris@example.com',
];

// You need to hash the email addresses and convert them to Buffer format
const hashedAddresses = emailAddresses.map(email => Buffer.from(sha256(email), 'hex'));

// Create a Merkle Tree from the list of hashed email addresses
const merkleTree = new MerkleTree(hashedAddresses, sha256Buffer);

// User's email address to prove
const targetEmail = 'ama@example.com';
const hashedTargetEmail = Buffer.from(sha256(targetEmail), 'hex');

// Find the index of the hashed target email address in the list
const targetIndex = hashedAddresses.indexOf(hashedTargetEmail);

if (targetIndex === -1) {
  console.log(`Email address "${targetEmail}" is not on the whitelist.`);
} else {
  // Generate a Merkle Proof for the target email address
  const proof = merkleTree.getProof(hashedTargetEmail);

  // Verifying the Merkle Proof
  const isProofValid = merkleTree.verify(proof, hashedTargetEmail, merkleTree.getRoot());

  if (isProofValid) {
    console.log(`Email address "${targetEmail}" is on the whitelist.`);
  } else {
    console.log(`Email address "${targetEmail}" is not on the whitelist.`);
  }
}

// sha256 function that returns hex string
function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// sha256 function that returns buffer, needed for the MerkleTree
function sha256Buffer(data) {
  return crypto.createHash('sha256').update(data).digest();
}
