import mongoose, { Schema, Document } from 'mongoose';

export interface IJourney extends Document {
  Departure: Date;
  Return: Date;
  DepartureStationId: number;
  DepartureStationName: string;
  ReturnStationId: number;
  ReturnStationName: string;
  CoveredDistance: number;
  Duration: number;
}

const JourneySchema: Schema = new Schema({
  Departure: { type: Date, required: true },
  Return: { type: Date, required: true },
  DepartureStationId: { type: Number, required: true },
  DepartureStationName: { type: String, required: true },
  ReturnStationId: { type: Number, required: true },
  ReturnStationName: { type: String, required: true },
  CoveredDistance: { type: Number, required: true },
  Duration: { type: Number, required: true },
});

export default mongoose.model<IJourney>('Journey', JourneySchema);
