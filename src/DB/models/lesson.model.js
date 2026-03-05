import mongoose from 'mongoose';
import slugify from 'slugify';

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    description: String,
    content: {
      type: String, 
    },
    video: {
      url: String,
      publicId: String,
      duration: Number, 
    },
    type: {
      type: String,
      enum: ['video', 'text', 'quiz', 'assignment'],
      default: 'video',
    },
    duration: Number, 
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    resourcesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Generate slug
lessonSchema.pre('save', async function () {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
});

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;