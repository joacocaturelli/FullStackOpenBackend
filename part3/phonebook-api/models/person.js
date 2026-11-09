import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Contact name must be at least 3 characters long"],
  },
  number: {
    type: String,
    required: true,
    minlength: [8, "Phone number must be at least 8 characters long"],
    validate: {
      validator: function (value) {
        return /^\d{2,3}-\d+$/.test(value);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const Person = mongoose.model("Person", personSchema);
