import mongoose from 'mongoose';

const VectorEmbeddingSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String},
  fileName: { type: String},
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  embedding: [Number],
});

export const VectorEmbedding = mongoose.model('vector_embeddings', VectorEmbeddingSchema);