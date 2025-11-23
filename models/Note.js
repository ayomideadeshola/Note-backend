const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: () => new mongoose.Types.ObjectId().toString()
        },
        title: {
            type: String,
            required: [true, "Title is required"]
        },
        content: {
            type: String,
            required: [true, "Content is required"]
        },
        tags: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

noteSchema.set("toJSON", {
    virtuals: true,
    transform: (_, ret) => {
        ret.id = ret.id || ret._id.toString();
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model("Note", noteSchema);
