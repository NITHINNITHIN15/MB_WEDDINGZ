const mongoose=require("mongoose")

const gallerySchema=new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['christian', 'hindu', 'muslim', 'pre-wedding', 'other']
  },
  width: Number,
  height: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports=mongoose.model('Gallery',gallerySchema)
