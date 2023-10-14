import { Request, Response } from "express";
import parsePdf from "../util/pdf_parser";
import { VectorEmbedding } from "../model/embedded";
import { MongoClient } from "mongodb";
import { OpenAI } from "langchain/llms/openai";

interface IEmbedding {
  object: string;
  data: {
    object: string;
    index: number;
    embedding: number[];
  }[];
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export const uploadEmbedding = async (req: Request, res: Response) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).send("No files were uploaded.");
    }

    const file = req.files.file;
    const dataBuffer = Array.isArray(file) ? file[0].data : file.data;

    const text = await parsePdf(dataBuffer);

    const embedding = await createEmbedding(text);

    const document = new VectorEmbedding({
      title: embedding.object,
      description: text,
      embedding: embedding.data[0].embedding,
    });

    await document.save();

    res.send("File uploaded!");
  } catch (error) {
    console.error(error);
  }
};

export const queryEmbedding = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    const embedding = await createEmbedding(query);

    const client = await MongoClient.connect(process.env.MONGO_URI as string);
    const collection = client
      .db()
      .collection("vector_embeddings");

    async function findSimilarDocuments(embedding: number[]) {
      try {
        // Query for similar documents.
        const documents = await collection
          .aggregate([
            {
              $search: {
                knnBeta: {
                  vector: embedding,
                  path: 'embedding',
                  k: 5,
                },
              },
            },
            {
              $project: {
                description: 1,
                score: { $meta: 'searchScore' },
              },
            },
          ])
          .toArray();
        return documents;
      } catch (err) {
        console.error(err)
      }
    }

    const similarDocuments = await findSimilarDocuments(embedding.data[0].embedding)

    if (typeof similarDocuments === 'undefined' || similarDocuments.length === 0) {
      return res.send('No similar documents found')
    }

    // gets the document with the highest score
    const highestScoreDoc = similarDocuments.reduce((highest, current) => {
      return highest.score > current.score ? highest : current
    })

    const prompt = `Based on this context: ${highestScoreDoc.description} \n\n Query: ${query} \n\n Answer:`

    const model = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.7,
    });
    const llmResult = await model.predict(prompt);

    res.send(llmResult);
  } catch (err) {
    console.error(err)
  }
}

const createEmbedding = async (text: string) => {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
  };

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers,
    body: JSON.stringify({
      'model': 'text-embedding-ada-002',
      'input': text
    }),
  });

  const json = await response.json();
  return json as IEmbedding;
}
