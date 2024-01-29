import mongoose, { Schema, InferSchemaType } from 'mongoose';

const nftSchema = new Schema({
  nftName: {
    type: String,
    trim: true,
  },

  belongToCollectionId: {
    type: Number,
  },

  tokenId: {
    type: Number,
  },

  nftCreator: {
    type: String,
    maxLength: [60, 'receiptAddress must be lesser than 30 characters'],
  },

  forkFrom: {
    type: Number,
    required: [true, 'forkFrom is required.'],
  },

  imageUrl: {
    type: String,
    maxLength: [200, 'imageUrl must be lesser than 200 characters'],
  },

  ipfsUrl: {
    type: String,
    maxLength: [200, 'imageUrl must be lesser than 200 characters'],
  },
});

export type MongoNFT = InferSchemaType<typeof nftSchema>;

const ForkNFT = mongoose.models.ForkNFT || mongoose.model('ForkNFT', nftSchema);

export default ForkNFT;
