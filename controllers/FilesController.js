import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid'; // Importing uuidv4 for generating UUIDs
import dbClient from '../utils/db';
// import redisClient from '../utils/redis';

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

class FilesController {
  static async postUpload(req, res) {
    const {
      name, type, parentId = '0', isPublic = false, data,
    } = req.body;
    const { userId } = req;

    // Checks if all required fields are present
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing or invalid type' });
    }
    if ((type === 'file' || type === 'image') && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    try {
      // Checks if parent file exists and is a folder if parentId is specified
      if (parentId !== '0') {
        const parentFile = await dbClient.db.collection('files').findOne({ _id: ObjectId(parentId) });
        if (!parentFile) {
          return res.status(400).json({ error: 'Parent not found' });
        }
        if (parentFile.type !== 'folder') {
          return res.status(400).json({ error: 'Parent is not a folder' });
        }
      }

      // Handles file data if type is file or image
      let localPath = '';
      if (type === 'file' || type === 'image') {
        // Decode the Base64 data and save to local file
        const fileData = Buffer.from(data, 'base64');
        const fileId = `${uuidv4()}`;
        localPath = path.join(FOLDER_PATH, fileId);
        fs.writeFileSync(localPath, fileData);
      }

      // Creates file document in MongoDB
      const newFile = {
        userId: ObjectId(userId),
        name,
        type,
        isPublic,
        parentId: ObjectId(parentId),
        localPath: type === 'file' || type === 'image' ? localPath : undefined,
      };

      const result = await dbClient.db.collection('files').insertOne(newFile);

      // Return new file document with status 201
      return res.status(201).json({
        id: result.insertedId,
        userId,
        name,
        type,
        isPublic,
        parentId,
      });
    } catch (error) {
      console.error('Error in postUpload:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default FilesController;
