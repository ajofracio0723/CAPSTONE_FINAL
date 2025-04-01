// models/ProductScan.js
import mongoose from 'mongoose';

const ProductScanSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  firstScanTimestamp: {
    type: Number,
    required: true
  },
  originalExpirationTimestamp: {  // Changed from expirationTimestamp to match your code
    type: Number,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  registrationTimestamp: {
    type: Number,
    required: true
  },
  totalScans: {
    type: Number,
    default: 1
  },
  lastScanTimestamp: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Create a compound index for faster lookups
// Note: Changed to include registrationTimestamp for unique identification
ProductScanSchema.index({ productName: 1, owner: 1, registrationTimestamp: 1 }, { unique: true });

// Use this approach to prevent model recompilation errors
const ProductScan = mongoose.models.ProductScan || mongoose.model('ProductScan', ProductScanSchema);

export default ProductScan;