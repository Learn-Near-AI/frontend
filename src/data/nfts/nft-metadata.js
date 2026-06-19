export const nftMetadataExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement NFT metadata storage (NEP-177)

**Requirements:**
- Store \`metadata: UnorderedMap<String, TokenMetadata>\`
- Implement \`set_metadata(token_id, title, description, media)\` — store metadata for a token
- Implement \`get_metadata(token_id)\` — view method returning metadata or None
- Use \`TokenMetadata\` from \`near_contract_standards::non_fungible_token::metadata\`

**Test:** get_metadata must return exactly what was set!`,
  },
  {
    title: 'The Token Card!',
    content: `Wallets use metadata to display NFTs in your collection — showing the art, name, and description.

Think of metadata as the **art and description** of your digital collectible. A token ID like "42" is just a number. But when you add metadata — title: "Dragon Lord", media: "https://..." — it becomes a visible, meaningful item!

**NEP-177** defines the standard metadata structure that wallets and marketplaces expect. The \`TokenMetadata\` struct is defined in \`near_contract_standards\`:

\`\`\`rust
pub struct TokenMetadata {
    pub title: Option<String>,         // Display name
    pub description: Option<String>,   // Human-readable description
    pub media: Option<String>,         // URL to media (image, video, etc.)
    pub media_hash: Option<String>,    // Base64 hash of media
    pub copies: Option<u64>,           // Number of copies (for editions)
    pub issued_at: Option<String>,     // ISO 8601 timestamp
    pub expires_at: Option<String>,
    pub starts_at: Option<String>,
    pub updated_at: Option<String>,
    pub extra: Option<String>,         // JSON blob for custom fields
    pub reference: Option<String>,     // URL to external data
    pub reference_hash: Option<String>,
}
\`\`\`

Most fields are \`Option<String>\` — you only set what you need. For this example, we focus on \`title\`, \`description\`, and \`media\`.`,
  },
  {
    title: 'Building the Metadata',
    content: `Creating a \`TokenMetadata\` requires setting all the optional fields:

\`\`\`rust
pub fn set_metadata(&mut self, token_id: String, title: String, description: String, media: String) {
    let meta = TokenMetadata {
        title: Some(title),
        description: Some(description),
        media: Some(media),
        media_hash: None,
        copies: None,
        issued_at: None,
        expires_at: None,
        starts_at: None,
        updated_at: None,
        extra: None,
        reference: None,
        reference_hash: None,
    };
    self.metadata.insert(&token_id, &meta);
}
\`\`\`

**Key points:**
- Wrap each value in \`Some()\` for fields you want to set, \`None\` for empty fields
- \`TokenMetadata\` uses \`Option<String>\` extensively — this is by design for the standard
- The \`media\` field typically points to an IPFS URL or an Arweave hash for permanence
- Storing metadata separately from the token means you can update metadata without transferring

**NEP-177 note:** The standard doesn't mandate which fields are required. Wallets typically show \`title\` and \`media\` as minimum; everything else is enhancement.`,
  },
  {
    title: 'Reading Metadata',
    content: `Retrieving metadata is a simple map lookup:

\`\`\`rust
pub fn get_metadata(&self, token_id: String) -> Option<TokenMetadata> {
    self.metadata.get(&token_id)
}
\`\`\`

Returns \`None\` if the token ID doesn't have metadata — clean and predictable.

**Where does metadata come from?** Metadata is typically set during the minting process. When you mint an NFT, you also create its metadata:
1. Upload your art to IPFS
2. Create a \`TokenMetadata\` struct
3. Call \`set_metadata\` with the new token ID and metadata
4. The NFT is now visible in wallets!

**Storing metadata separately vs inline in Token:**
- **Separate (this example)** — cleaner separation, can update metadata independently
- **Inline in Token** — fewer storage operations (one instead of two), but couples metadata with ownership

Both approaches are valid. The NEAR ecosystem uses both. For learning, separate is clearer. For gas optimization, inline is better.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Metadata makes NFTs visible and meaningful. Without it, you just have numbers on a blockchain. With it, you have art, names, descriptions — real collectibles.

But metadata storage costs gas. Every \`Some(title)\` you add increases the storage footprint. A large \`description\` field costs more. The \`media\` URL alone can be 100+ bytes of storage.

Also, metadata is **not verified**. Anyone can set metadata claiming their NFT is a "Rare Dragon" when it's just a pixel. For verified metadata, use \`reference\` and \`reference_hash\` to link to authenticated off-chain data.

**When to store metadata on-chain:**
- Small metadata (title, short description)
- When metadata immutability matters
- When you want metadata always available

**When to store metadata off-chain:**
- Large files (images, videos)
- Dynamic metadata that updates
- When gas costs are a concern

For media files specifically: never store images on-chain. Use IPFS or Arweave and put the URL in the \`media\` field.`,
  },
  {
    title: "Don't Do This!",
    content: `Storing raw strings instead of the TokenMetadata struct:

\`\`\`rust
// BAD: Raw strings instead of structured TokenMetadata
pub fn set_title(&mut self, token_id: String, title: String) {
    self.titles.insert(&token_id, &title);
}
pub fn set_description(&mut self, token_id: String, desc: String) {
    self.descriptions.insert(&token_id, &desc);
}
\`\`\`

**Problems:**
- Multiple storage reads for a single piece of metadata (one per field)
- Non-standard — wallets and marketplaces won't recognize it
- More code to maintain (separate methods for each field)

Always use the standard \`TokenMetadata\` struct. It's what wallets, marketplaces, and indexers expect. Deviating from NEP-177 means your NFTs won't show up in user interfaces.

**Another mistake:** Using mutable metadata after mint without checks. If anyone can change metadata, users can't trust what they're buying. Always restrict metadata writes to the token owner or contract owner.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Store and retrieve NFT metadata using the NEP-177 standard.

**Code Snippet:**
\`\`\`rust
pub fn set_metadata(&mut self, token_id: String, title: String, description: String, media: String) {
    // TODO: Build a TokenMetadata with title, description, media
    // TODO: Insert into self.metadata
}
\`\`\`

**Solution Hints:**
- Build \`TokenMetadata\` with title, description, media as \`Some(...)\` and all other fields as \`None\`
- Insert: \`self.metadata.insert(&token_id, &meta);\`
- View: \`self.metadata.get(&token_id)\`
- The \`TokenMetadata\` type is imported from \`near_contract_standards::non_fungible_token::metadata\`

**Required fields to set:**
\`\`\`rust
TokenMetadata {
    title: Some(title),
    description: Some(description),
    media: Some(media),
    // All other fields: None
}
\`\`\`

[Learn more about NEP-177 →](https://learnnear.club/nep-177-nft-metadata/)`,
  },
];

export default nftMetadataExplanation;
