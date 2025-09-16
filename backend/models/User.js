// // const mongoose = require('mongoose');

// // const userSchema = new mongoose.Schema({
// //   phoneNumber: {
// //     type: String,
// //     required: true,
// //     unique: true,
// //     match: /^[0-9]{10}$/
// //   },
// //   role: {
// //     type: String,
// //     enum: ['conductor', 'passenger', 'admin'],
// //     required: true
// //   },
// //   name: {
// //     type: String,
// //     required: true
// //   },
// //   conductorId: {
// //     type: String,
// //     required: function() {
// //       return this.role === 'conductor';
// //     }
// //   },
// //   isVerified: {
// //     type: Boolean,
// //     default: false
// //   },
// //   otp: {
// //     code: String,
// //     expiresAt: Date
// //   }
// // }, {
// //   timestamps: true
// // });

// // module.exports = mongoose.model('User', userSchema);
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     phoneNumber: {
//       type: String,
//       required: true,
//       unique: true,
//       match: /^[0-9]{10}$/, // must be 10-digit number
//     },
//     role: {
//       type: String,
//       enum: ["conductor", "passenger", "admin"],
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     conductorId: {
//       type: String,
//       required: function () {
//         return this.role === "conductor"; // only required for conductors
//       },
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     otp: {
//       code: { type: String },
//       expiresAt: { type: Date },
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);



const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/,
    },
    role: {
      type: String,
      enum: ["conductor", "passenger", "admin"],
      required: true,
      default: "passenger" // ✅ default to passenger
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    conductorId: {
      type: String,
      required: function () {
        return this.role === "conductor";
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      code: { type: String },
      expiresAt: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
