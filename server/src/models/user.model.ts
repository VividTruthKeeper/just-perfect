import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUserInput extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  token: string;
}

export interface IUserDocument extends IUserInput, Document {
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema<IUserInput>(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });

UserSchema.virtual("fullName").get(function (this: IUserDocument) {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.pre("save", async function (this: IUserDocument, next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = bcrypt.hashSync(this.password, salt);

  this.password = hash;

  return next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as IUserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((_e) => false);
};

export default mongoose.model<IUserDocument>("User", UserSchema);
