// const express = require('express');
const multer = require('multer');
const MulterAzureStorage = require('multer-azure-blob-storage')
  .MulterAzureStorage;

const resolveBlobName = (req, file) => {
  return new Promise(resolve => {
    resolve(Date.now() + '-' + file.originalname);
  });
};

const azureStorage = new MulterAzureStorage({
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  accessKey: process.env.AZURE_STORAGE_ACCESS_KEY,
  accountName: process.env.AZURE_STORAGE_ACCOUNT,
  containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
  blobName: resolveBlobName,
  containerAccessLevel: 'blob',
  // 60m * 24 hrs * 30 days * 12 months * 3 years = 3 years
  urlExpirationTime: 60 * 24 * 30 * 12 * 3
});

const upload = multer({
  storage: azureStorage
});

function AzureUploader(app) {
  app.post('/api/upload', upload.single('image'), (req, res) => {
    console.log(req.file.url);
    res.status(200).send(req.file.url);
  });

  return app;
}

module.exports = AzureUploader;
