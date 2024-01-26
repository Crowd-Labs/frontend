import mongoose, { InferSchemaType, Schema } from 'mongoose';

const collectionSchema = new Schema({
  collectionName: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
    maxLength: [50, 'Name must be lesser than 50 characters'],
  },

  collectionDesc: {
    type: String,
    maxLength: [200, 'collectionDesc must be lesser than 200 characters'],
  },

  creator: {
    type: String,
    maxLength: [60, 'receiptAddress must be lesser than 60 characters'],
  },

  collectionId: {
    type: Number,
  },

  logoImage: {
    type: String,
    maxLength: [200, 'logoImage url must be lesser than 200 characters'],
  },

  website: {
    type: String,
    maxLength: [50, 'website must be lesser than 50 characters'],
  },

  twitter: {
    type: String,
    maxLength: [50, 'twitter Name must be lesser than 50 characters'],
  },

  telegram: {
    type: String,
    maxLength: [50, 'Telegram Name must be lesser than 50 characters'],
  },

  medium: {
    type: String,
    maxLength: [50, 'Medium Name must be lesser than 50 characters'],
  },

  discord: {
    type: String,
    maxLength: [50, 'Discord Name must be lesser than 50 characters'],
  },

  mintLimit: {
    type: Number,
    required: [true, 'mintLimit is required.'],
  },

  royalty: {
    type: Number,
    required: [true, 'royalty is required.'],
  },

  endTime: {
    type: Date,
    required: [true, 'endTime is required.'],
  },

  bCharge: {
    type: Boolean,
    required: [true, 'bCharge is required.'],
  },

  mintPrice: {
    type: Number,
  },

  currency: {
    type: String,
  },

  receiptAddress: {
    type: String,
    maxLength: [60, 'receiptAddress must be lesser than 60 characters'],
  },

  bWhitelist: {
    type: Boolean,
  },

  whitelistRootHash: {
    type: String,
  },
});

export type MongoCollection = InferSchemaType<typeof collectionSchema>;

const CreateCollection = mongoose.models.Collection || mongoose.model('Collection', collectionSchema);

export default CreateCollection;
