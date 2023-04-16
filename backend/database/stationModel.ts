import mongoose, { Schema, Document } from 'mongoose';

export interface IStation extends Document {
  FID: number;
  ID: number;
  Nimi: string;
  Namn: string;
  Name: string;
  Osoite: string;
  Adress: string;
  Kaupunki: string;
  Stad: string;
  Operaattor: string;
  Kapasiteet: number;
  x: number;
  y: number;
}

const StationSchema: Schema = new Schema({
  FID: { type: Number, required: true },
  ID: { type: Number, required: true },
  Nimi: { type: String, required: true },
  Namn: { type: String },
  Name: { type: String },
  Osoite: { type: String, required: true },
  Adress: { type: String },
  Kaupunki: { type: String, required: true },
  Stad: { type: String },
  Operaattor: { type: String },
  Kapasiteet: { type: Number, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

export default mongoose.model<IStation>('Station', StationSchema);
