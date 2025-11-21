const mongoose=require("mongoose")

const testimonialSchema=mongoose.Schema({
    name: {
    type: String,
    required: true,
    trim: true
  },
  weddingType: {
    type: String,
    required: true,
    trim: true
  },
  testimonial: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports=mongoose.model('Testimonial',testimonialSchema)