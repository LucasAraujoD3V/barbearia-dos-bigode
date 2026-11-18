module.exports = {
  timestamps: true,
  toJSON: {
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = String(ret._id);
      delete ret._id;
      return ret;
    },
  },
};
