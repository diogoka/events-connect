import express from 'express';
import axios from 'axios';

export const getLocation = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?types=establishment|geocode&input=${req.query.input}&components=country:ca&key=${process.env.GOOGLE_PLACES_API_KEY}`
    );

    const options: string[] = result.data.predictions.map((prediction: any) => {
      return prediction.description;
    });

    res.status(200).json(options);
  } catch (error: any) {
    console.error(error);
    res.status(500);
  }
};
